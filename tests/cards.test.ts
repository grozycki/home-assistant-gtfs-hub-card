import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../src/index";
import type { GtfsHubDeparturesCard } from "../src/departures-card";
import { type GtfsHubLineMapCard, painterOf, vehiclesOf } from "../src/line-map-card";
import type { HassEntity } from "../src/types";
import { NOW, at, departure, hass, sensor } from "./fixtures";

async function mount<T extends HTMLElement & { updateComplete: Promise<boolean> }>(
  tag: string,
  setup: (element: T) => void,
): Promise<T> {
  const element = document.createElement(tag) as T;
  setup(element);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function text(element: HTMLElement): string {
  return element.shadowRoot?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("departures card", () => {
  it("renders rows from the sensor and its attribution", async () => {
    const card = await mount<GtfsHubDeparturesCard>("gtfs-hub-departures-card", (element) => {
      element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.bogucice_next_departure" });
      element.hass = hass([sensor([departure({ predicted: at(450), delay: 190, status: "predicted" })])]);
    });
    expect(text(card)).toContain("Piotrowice Pętla");
    expect(text(card)).toContain("7 min +3");
    expect(text(card)).toContain("Data source: GZM ZTM");
    const badge = card.shadowRoot?.querySelector<HTMLElement>(".badge");
    expect(badge?.getAttribute("style")).toContain("background:#1A1A1A");
  });

  it("is named after the stop's device", async () => {
    const card = await mount<GtfsHubDeparturesCard>("gtfs-hub-departures-card", (element) => {
      element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.bogucice_next_departure" });
      element.hass = {
        ...hass([sensor([departure()])]),
        entities: { "sensor.bogucice_next_departure": { device_id: "d1" } },
        devices: { d1: { name: "Bogucice Cmentarz", name_by_user: null } },
      };
    });
    const header = card.shadowRoot?.querySelector("ha-card") as unknown as { header?: string };
    expect(header.header).toBe("Bogucice Cmentarz");
  });

  it("follows the sensor", async () => {
    const card = await mount<GtfsHubDeparturesCard>("gtfs-hub-departures-card", (element) => {
      element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.bogucice_next_departure" });
      element.hass = hass([sensor([departure()])]);
    });
    card.hass = hass([sensor([departure({ headsign: "Zawodzie" })])]);
    await card.updateComplete;
    expect(text(card)).toContain("Zawodzie");
  });

  it("says when the entity is unavailable or the list empty", async () => {
    const unavailable = await mount<GtfsHubDeparturesCard>("gtfs-hub-departures-card", (element) => {
      element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.bogucice_next_departure" });
      element.hass = hass([sensor([], "unavailable")], "pl");
    });
    expect(text(unavailable)).toContain("Niedostępne");
    const empty = await mount<GtfsHubDeparturesCard>("gtfs-hub-departures-card", (element) => {
      element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.bogucice_next_departure" });
      element.hass = hass([sensor([])]);
    });
    expect(text(empty)).toContain("No departures");
  });

  it("refuses a config without an entity", () => {
    const card = document.createElement("gtfs-hub-departures-card") as GtfsHubDeparturesCard;
    expect(() => card.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "" })).toThrow();
  });

  it("passes editor changes on as a new config", async () => {
    const editor = await mount<HTMLElement & { updateComplete: Promise<boolean>; setConfig(c: object): void; hass: unknown }>(
      "gtfs-hub-departures-card-editor",
      (element) => {
        element.setConfig({ type: "custom:gtfs-hub-departures-card", entity: "sensor.a" });
        element.hass = hass([]);
      },
    );
    const seen: unknown[] = [];
    editor.addEventListener("config-changed", (event) => seen.push((event as CustomEvent).detail.config));
    const form = editor.shadowRoot?.querySelector("ha-form");
    const next = { type: "custom:gtfs-hub-departures-card", entity: "sensor.b" };
    form?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: next } }));
    expect(seen).toEqual([next]);
  });
});

function tracker(id: string, attributes: Record<string, unknown>, state = "not_home"): HassEntity {
  return { entity_id: id, state, attributes };
}

describe("line map card", () => {
  const line = { provider: "gzm", line: "11", route_type: 3 };

  it("finds the vehicles of one line of one source", () => {
    const states = Object.fromEntries(
      [
        tracker("device_tracker.gtfs_hub_gzm_11_1739", line),
        tracker("device_tracker.gtfs_hub_krakow_11_2", { ...line, provider: "krakow" }),
        tracker("device_tracker.gtfs_hub_gzm_t11_1", { ...line, route_type: 0 }),
        tracker("device_tracker.gtfs_hub_gzm_11_5", line, "unavailable"),
        tracker("sensor.gtfs_hub_gzm_11", line),
      ].map((state) => [state.entity_id, state]),
    );
    expect(vehiclesOf(states, line)).toEqual(["device_tracker.gtfs_hub_gzm_11_1739"]);
  });

  it("says when the map cannot draw paths", async () => {
    vi.useRealTimers();
    // A map without Leaflet internals, as a changed frontend might give.
    if (!customElements.get("ha-map")) customElements.define("ha-map", class extends HTMLElement {});
    const response = { ...line, line_color: "#1A1A1A", line_text_color: "#FFD200", shapes: [{ id: "a", points: [[50, 19], [50.1, 19.1]] }] };
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
    });
    await vi.waitFor(() => expect(text(card)).toContain("cannot draw paths"), { timeout: 8000 });
  }, 10_000);

  it("draws paths with the MapLibre engine, without a dot per point", () => {
    const added: unknown[] = [];
    const fitted: unknown[] = [];
    const engine = {
      addPath: (path: unknown) => (added.push(path), { remove() {} }),
      fitBounds: (points: unknown, options: unknown) => fitted.push([points, options]),
    };
    expect(painterOf(Object.assign(document.createElement("div"), { _engine: { ...engine } }))).toBeUndefined();
    const painter = painterOf(Object.assign(document.createElement("div"), { _engine: { ...engine, _map: {} } }));
    painter?.path([[50, 19], [50.1, 19.1]], "#FFD200");
    painter?.fit([[50, 19]]);
    expect(added).toEqual([{ color: "#FFD200", segments: [{ points: [[50, 19], [50.1, 19.1]] }], markers: [] }]);
    expect(fitted).toEqual([[[[50, 19]], { pad: 0.05, maxZoom: 17, padding: { top: 16, right: 16, bottom: 16, left: 16 } }]]);
  });

  it("falls back to Leaflet on older maps", () => {
    const drawn: unknown[] = [];
    const leaflet = {
      polyline: (points: unknown) => (drawn.push(points), { addTo() { return { remove() {} }; }, remove() {} }),
      latLngBounds: (points: unknown[]) => points.length,
    };
    const fitted: unknown[] = [];
    const map = Object.assign(document.createElement("div"), {
      Leaflet: leaflet,
      leafletMap: { fitBounds: (bounds: unknown) => fitted.push(bounds) },
    });
    const painter = painterOf(map);
    painter?.path([[50, 19]], "#000000");
    painter?.fit([[50, 19], [51, 20]]);
    expect(drawn).toEqual([[[50, 19]]]);
    expect(fitted).toEqual([2]);
  });

  it("draws in the path colour once the map's engine appears", async () => {
    vi.useRealTimers();
    const added: { color: string }[] = [];
    const response = {
      ...line,
      line_color: "#1A1A1A",
      line_text_color: "#FFD200",
      path_color: "#FFD200",
      shapes: [{ id: "a", points: [[50, 19], [50.1, 19.1]] as [number, number][] }],
    };
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
    });
    await vi.waitFor(() => expect(card.shadowRoot?.querySelector("ha-map")).not.toBeNull());
    Object.assign(card.shadowRoot?.querySelector("ha-map") as HTMLElement, {
      _engine: { _map: {}, addPath: (path: { color: string }) => (added.push(path), { remove() {} }), fitBounds() {} },
    });
    await vi.waitFor(() => expect(added.map((path) => path.color)).toEqual(["#FFD200"]));
  });

  it("draws again on a map that starts late or rebuilds its engine", async () => {
    vi.useRealTimers();
    const added: unknown[] = [];
    const engine = () => ({ _map: {}, addPath: (path: unknown) => (added.push(path), { remove() {} }), fitBounds() {} });
    const response = {
      ...line,
      line_color: "#1A1A1A",
      line_text_color: "#FFD200",
      shapes: [{ id: "a", points: [[50, 19], [50.1, 19.1]] as [number, number][] }],
    };
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
    });
    await vi.waitFor(() => expect(text(card)).toContain("cannot draw paths"), { timeout: 8000 });
    const map = card.shadowRoot?.querySelector("ha-map") as HTMLElement;
    Object.assign(map, { _engine: engine() });
    card.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
    await vi.waitFor(() => expect(added).toHaveLength(1));
    Object.assign(map, { _engine: engine() });
    card.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
    await vi.waitFor(() => expect(added).toHaveLength(2));
  }, 12_000);

  it("calls the action once while the first call is pending", async () => {
    vi.useRealTimers();
    let calls = 0;
    let answer: (value: unknown) => void = () => undefined;
    const pending = <T,>() => {
      calls += 1;
      return new Promise<T>((resolve) => (answer = resolve as (value: unknown) => void));
    };
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", pending);
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
    });
    for (let index = 0; index < 5; index += 1) {
      card.hass = hass([], "en", pending);
      await card.updateComplete;
    }
    expect(calls).toBe(1);
    answer({ response: { ...line, line_color: "#000000", line_text_color: "#FFFFFF", shapes: [] } });
  });

  it("passes map editor changes on as a new config", async () => {
    const editor = await mount<HTMLElement & { updateComplete: Promise<boolean>; setConfig(c: object): void; hass: unknown }>(
      "gtfs-hub-line-map-card-editor",
      (element) => {
        element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
        element.hass = hass([]);
      },
    );
    const seen: unknown[] = [];
    editor.addEventListener("config-changed", (event) => seen.push((event as CustomEvent).detail.config));
    const next = { type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "6" };
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: next } }));
    expect(seen).toEqual([next]);
  });

  it("shows the action's refusal", async () => {
    vi.useRealTimers();
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", () => Promise.reject({ code: "service_validation_error", message: "Line 99 is not selected" }));
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "99" });
    });
    await vi.waitFor(() => expect(text(card)).toContain("Line 99 is not selected"));
  });
});
