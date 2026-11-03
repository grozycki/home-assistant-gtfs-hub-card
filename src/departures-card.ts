/** A stop board read from a GTFS Hub departures sensor. */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";

import { MAX_LIMIT, departuresOf, rowsOf } from "./board";
import { strings } from "./i18n";
import type { HomeAssistant } from "./types";

export interface DeparturesCardConfig {
  type: string;
  entity: string;
  title?: string;
  limit?: number;
}

const TICK_MS = 15_000;

export function languageOf(hass: HomeAssistant): string {
  return hass.locale?.language ?? hass.language ?? "en";
}

/** Name a board after the stop's device, as sensor names add what they measure. */
export function stopName(hass: HomeAssistant, entityId: string): string | undefined {
  const deviceId = hass.entities?.[entityId]?.device_id;
  const device = deviceId ? hass.devices?.[deviceId] : undefined;
  const name = device?.name_by_user ?? device?.name ?? hass.states[entityId]?.attributes["friendly_name"];
  return typeof name === "string" ? name : undefined;
}

export class GtfsHubDeparturesCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _now: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DeparturesCardConfig;
  declare _now: Date;
  private _timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    super();
    this._now = new Date();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("gtfs-hub-departures-card-editor");
  }

  static getStubConfig(hass: HomeAssistant): Omit<DeparturesCardConfig, "type"> {
    const entity = Object.keys(hass.states).find(
      (id) => id.startsWith("sensor.") && Array.isArray(hass.states[id]?.attributes["departures"]),
    );
    return { entity: entity ?? "", limit: MAX_LIMIT };
  }

  setConfig(config: DeparturesCardConfig): void {
    if (!config.entity) throw new Error("Choose a departures sensor");
    this._config = config;
  }

  getCardSize(): number {
    return 1 + Math.min(this._config?.limit ?? MAX_LIMIT, MAX_LIMIT);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The sensor changes once a tick; minutes to go change in between.
    this._timer = setInterval(() => (this._now = new Date()), TICK_MS);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const before = changed.get("hass");
    const entity = this._config?.entity;
    return !before || !entity || before.states[entity] !== this.hass?.states[entity];
  }

  protected override render(): unknown {
    if (!this.hass || !this._config) return nothing;
    const language = languageOf(this.hass);
    const text = strings(language);
    const state = this.hass.states[this._config.entity];
    const title = this._config.title ?? stopName(this.hass, this._config.entity);
    const attribution = state?.attributes["attribution"];
    let body: unknown;
    if (!state || state.state === "unavailable") {
      body = html`<div class="empty">${text.unavailable}</div>`;
    } else {
      const rows = rowsOf(
        departuresOf(state.attributes["departures"]),
        this._now,
        this._config.limit ?? MAX_LIMIT,
        language,
        this.hass.config.time_zone,
        this.hass.locale?.time_format,
      );
      body = rows.length
        ? html`<ul>
            ${rows.map(
              (row) => html`<li class=${row.struck ? "struck" : ""}>
                <span class="badge" style="background:${row.background};color:${row.text}"
                  >${row.line}</span
                >
                <span class="headsign"
                  >${row.headsign}${row.note ? html` <em>${row.note}</em>` : nothing}</span
                >
                <span class="time">
                  ${row.live ? html`<span class="live" title=${text.live}></span>` : nothing}
                  ${row.time}${row.delay ? html` <span class="delay">${row.delay}</span>` : nothing}
                </span>
              </li>`,
            )}
          </ul>`
        : html`<div class="empty">${text.none}</div>`;
    }
    return html`<ha-card .header=${title}>
      <div class="card-content">${body}</div>
      ${typeof attribution === "string"
        ? html`<div class="attribution">${attribution}</div>`
        : nothing}
    </ha-card>`;
  }

  static override styles = css`
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 6px 0;
    }
    li + li {
      border-top: 1px solid var(--divider-color);
    }
    .badge {
      min-width: 2.6em;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      text-align: center;
      box-sizing: border-box;
    }
    .headsign {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .struck .headsign,
    .struck .time {
      text-decoration: line-through;
      color: var(--secondary-text-color);
    }
    em {
      font-style: normal;
      color: var(--error-color);
      text-decoration: none;
      display: inline-block;
    }
    .time {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .live {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success-color, #43a047);
      margin-right: 4px;
    }
    .delay {
      color: var(--error-color);
      font-weight: 700;
    }
    .empty {
      color: var(--secondary-text-color);
    }
    .attribution {
      padding: 0 16px 12px;
      font-size: 0.75em;
      color: var(--secondary-text-color);
    }
  `;
}

export class GtfsHubDeparturesCardEditor extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DeparturesCardConfig;

  setConfig(config: DeparturesCardConfig): void {
    this._config = config;
  }

  protected override render(): unknown {
    if (!this.hass || !this._config) return nothing;
    const text = strings(languageOf(this.hass));
    const labels: Record<string, string> = { entity: text.entity, title: text.title, limit: text.limit };
    const schema = [
      { name: "entity", required: true, selector: { entity: { integration: "gtfs_hub", domain: "sensor" } } },
      { name: "title", selector: { text: {} } },
      { name: "limit", selector: { number: { min: 1, max: MAX_LIMIT, mode: "box" } } },
    ];
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${schema}
      .computeLabel=${(item: { name: string }) => labels[item.name] ?? item.name}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  private _changed(event: CustomEvent<{ value: DeparturesCardConfig }>): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: event.detail.value }, bubbles: true, composed: true }),
    );
  }
}
