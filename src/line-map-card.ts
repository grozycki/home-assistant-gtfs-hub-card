/** The paths of one tracked line with its vehicles, on Home Assistant's own map. */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";

import { languageOf } from "./departures-card";
import { strings } from "./i18n";
import type { HassEntity, HomeAssistant } from "./types";

export interface LineMapCardConfig {
  type: string;
  entry: string;
  line: string;
  route_type?: number;
  height?: number;
}

export interface LineShapes {
  provider: string;
  line: string;
  route_type: number;
  line_color: string;
  line_text_color: string;
  // Missing from integrations older than the path colour.
  path_color?: string;
  shapes: { id: string; points: [number, number][] }[];
}

/** A drawn path, which a redraw removes. */
interface Layer {
  remove(): void;
}

/** The map engine of Home Assistant 2026.10 and later, built on MapLibre. */
interface Engine {
  addPath(path: { color: string; segments: { points: [number, number][] }[]; markers: [] }): Layer;
  fitBounds(
    points: [number, number][],
    options: { pad: number; padding: Record<"top" | "right" | "bottom" | "left", number> },
  ): void;
}

/** Leaflet, which older Home Assistant maps were built on. */
interface Leaflet {
  polyline(points: [number, number][], options: Record<string, unknown>): Layer & { addTo(map: LeafletMap): Layer };
  latLngBounds(points: [number, number][]): unknown;
}
interface LeafletMap {
  fitBounds(bounds: unknown, options: Record<string, unknown>): void;
}

interface HaMap extends HTMLElement {
  _engine?: Partial<Engine>;
  leafletMap?: LeafletMap;
  Leaflet?: Leaflet;
  updateComplete?: Promise<unknown>;
}

/** A way to draw on the map, whichever internals this Home Assistant has. */
interface Painter {
  path(points: [number, number][], colour: string): Layer;
  fit(points: [number, number][]): void;
}

const PADDING = 16;

/** Find how to draw on a map. Both ways are frontend internals, so neither may be there. */
export function painterOf(map: HaMap): Painter | undefined {
  const engine = map._engine;
  if (typeof engine?.addPath === "function" && typeof engine.fitBounds === "function") {
    const { addPath, fitBounds } = engine as Engine;
    return {
      // One segment per path, with no markers, draws a line without a dot at every point.
      path: (points, colour) => addPath.call(engine, { color: colour, segments: [{ points }], markers: [] }),
      fit: (points) =>
        fitBounds.call(engine, points, {
          pad: 0.05,
          padding: { top: PADDING, right: PADDING, bottom: PADDING, left: PADDING },
        }),
    };
  }
  const { leafletMap, Leaflet: leaflet } = map;
  if (leafletMap && leaflet) {
    return {
      path: (points, colour) =>
        leaflet.polyline(points, { color: colour, weight: 4, opacity: 0.8, interactive: false }).addTo(leafletMap),
      fit: (points) => leafletMap.fitBounds(leaflet.latLngBounds(points), { padding: [PADDING, PADDING] }),
    };
  }
  return undefined;
}

const REFRESH_MS = 3_600_000;
const MAP_WAIT_MS = 5_000;
const DEFAULT_HEIGHT = 400;

/** Return the trackers of one line of one source, which their attributes name. */
export function vehiclesOf(
  states: Record<string, HassEntity | undefined>,
  line: Pick<LineShapes, "provider" | "line" | "route_type">,
): string[] {
  return Object.values(states)
    .filter(
      (state): state is HassEntity =>
        state !== undefined &&
        state.entity_id.startsWith("device_tracker.") &&
        state.state !== "unavailable" &&
        state.attributes["provider"] === line.provider &&
        state.attributes["line"] === line.line &&
        state.attributes["route_type"] === line.route_type,
    )
    .map((state) => state.entity_id)
    .sort();
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** `ha-map` loads only with the built-in map card, so creating one loads it. */
async function loadMap(): Promise<void> {
  if (customElements.get("ha-map")) return;
  const helpers = (window as { loadCardHelpers?: () => Promise<{ createCardElement(c: object): unknown }> })
    .loadCardHelpers;
  if (helpers) (await helpers()).createCardElement({ type: "map", entities: ["zone.home"] });
  await Promise.race([customElements.whenDefined("ha-map"), sleep(MAP_WAIT_MS)]);
}

export class GtfsHubLineMapCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _shapes: { state: true },
    _error: { state: true },
    _noPaths: { state: true },
    _mapReady: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: LineMapCardConfig;
  declare _shapes: LineShapes | undefined;
  declare _error: string | undefined;
  declare _noPaths: boolean;
  declare _mapReady: boolean;
  private _layers: Layer[] = [];
  private _fitted = false;
  private _fetching = false;
  private _timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    super();
    this._noPaths = false;
    this._mapReady = false;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("gtfs-hub-line-map-card-editor");
  }

  static getStubConfig(): Omit<LineMapCardConfig, "type"> {
    return { entry: "", line: "" };
  }

  setConfig(config: LineMapCardConfig): void {
    if (!config.entry || !config.line) throw new Error("Choose a source and a line");
    const changed = config.entry !== this._config?.entry || config.line !== this._config?.line ||
      config.route_type !== this._config?.route_type;
    this._config = config;
    if (changed) {
      this._shapes = undefined;
      this._fitted = false;
      if (this.isConnected) void this._fetch();
    }
  }

  getCardSize(): number {
    return Math.ceil((this._config?.height ?? DEFAULT_HEIGHT) / 50);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void loadMap().then(() => (this._mapReady = Boolean(customElements.get("ha-map"))));
    void this._fetch();
    // Paths change with the daily schedule, not with the vehicles.
    this._timer = setInterval(() => void this._fetch(), REFRESH_MS);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  private async _fetch(): Promise<void> {
    // State changes come many times a second, and must not each start a call.
    if (!this.hass || !this._config || this._fetching) return;
    this._fetching = true;
    const data: Record<string, unknown> = { config_entry_id: this._config.entry, line: this._config.line };
    if (this._config.route_type !== undefined) data["route_type"] = this._config.route_type;
    try {
      const result = await this.hass.callWS<{ response: LineShapes }>({
        type: "call_service",
        domain: "gtfs_hub",
        service: "get_line_shapes",
        service_data: data,
        return_response: true,
      });
      this._shapes = result.response;
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : String((err as { message?: unknown }).message ?? err);
    } finally {
      this._fetching = false;
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has("_shapes") || changed.has("_mapReady")) void this._drawPaths();
    if (changed.has("hass") && !this._shapes && !this._error) void this._fetch();
  }

  private async _drawPaths(): Promise<void> {
    const map = this.renderRoot.querySelector<HaMap>("ha-map");
    if (!map || !this._shapes) return;
    // The map builds its engine on its own, after its first render.
    const deadline = Date.now() + MAP_WAIT_MS;
    let painter = painterOf(map);
    while (!painter && Date.now() < deadline) {
      await (map.updateComplete ?? sleep(100));
      await sleep(100);
      painter = painterOf(map);
    }
    if (!painter) {
      this._noPaths = true;
      return;
    }
    this._noPaths = false;
    this._layers.forEach((layer) => layer.remove());
    const colour = this._shapes.path_color ?? this._shapes.line_color;
    this._layers = this._shapes.shapes.map((shape) => painter.path(shape.points, colour));
    const points = this._shapes.shapes.flatMap((shape) => shape.points);
    if (!this._fitted && points.length) {
      painter.fit(points);
      this._fitted = true;
    }
  }

  protected override render(): unknown {
    if (!this.hass || !this._config) return nothing;
    const text = strings(languageOf(this.hass));
    const entities = this._shapes ? vehiclesOf(this.hass.states, this._shapes) : [];
    const height = this._config.height ?? DEFAULT_HEIGHT;
    return html`<ha-card>
      ${this._error ? html`<div class="note">${this._error}</div>` : nothing}
      ${this._noPaths ? html`<div class="note">${text.noPaths}</div>` : nothing}
      ${this._mapReady
        ? html`<ha-map
            style="height:${height}px"
            .hass=${this.hass}
            .entities=${entities}
            .autoFit=${false}
            .zoom=${13}
          ></ha-map>`
        : html`<div style="height:${height}px"></div>`}
    </ha-card>`;
  }

  static override styles = css`
    ha-card {
      overflow: hidden;
    }
    .note {
      padding: 8px 16px;
      color: var(--secondary-text-color);
    }
  `;
}

export class GtfsHubLineMapCardEditor extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: LineMapCardConfig;

  setConfig(config: LineMapCardConfig): void {
    this._config = config;
  }

  protected override render(): unknown {
    if (!this.hass || !this._config) return nothing;
    const text = strings(languageOf(this.hass));
    const labels: Record<string, string> = {
      entry: text.entry,
      line: text.line,
      route_type: text.routeType,
      height: text.height,
    };
    const schema = [
      { name: "entry", required: true, selector: { config_entry: { integration: "gtfs_hub" } } },
      { name: "line", required: true, selector: { text: {} } },
      { name: "route_type", selector: { number: { min: 0, max: 1799, mode: "box" } } },
      { name: "height", selector: { number: { min: 200, max: 1200, step: 50, mode: "box" } } },
    ];
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${schema}
      .computeLabel=${(item: { name: string }) => labels[item.name] ?? item.name}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  private _changed(event: CustomEvent<{ value: LineMapCardConfig }>): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: event.detail.value }, bubbles: true, composed: true }),
    );
  }
}
