import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../src/index";
import type { GtfsHubDeparturesCard } from "../src/departures-card";
import { type GtfsHubLineMapCard, vehiclesOf } from "../src/line-map-card";
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

  it("draws paths and fits them when the map has Leaflet", async () => {
    vi.useRealTimers();
    const drawn: [number, number][][] = [];
    const fitted: unknown[] = [];
    class LeafletMap extends HTMLElement {
      leafletMap = { fitBounds: (bounds: unknown) => fitted.push(bounds) };
      Leaflet = {
        polyline: (points: [number, number][]) => {
          drawn.push(points);
          return { addTo() { return this; }, remove() {} };
        },
        latLngBounds: (points: [number, number][]) => points.length,
      };
    }
    customElements.define("ha-map-with-leaflet", LeafletMap);
    const response = { ...line, line_color: "#1A1A1A", line_text_color: "#FFD200", shapes: [{ id: "a", points: [[50, 19], [50.1, 19.1]] as [number, number][] }] };
    const card = await mount<GtfsHubLineMapCard>("gtfs-hub-line-map-card", (element) => {
      element.hass = hass([], "en", <T,>() => Promise.resolve({ response } as T));
      element.setConfig({ type: "custom:gtfs-hub-line-map-card", entry: "e1", line: "11" });
    });
    await vi.waitFor(() => expect(card.shadowRoot?.querySelector("ha-map")).not.toBeNull());
    const map = card.shadowRoot?.querySelector("ha-map") as unknown as Record<string, unknown>;
    Object.assign(map, new LeafletMap());
    // Redraw now that the stand-in has Leaflet.
    (card as unknown as { _shapes: unknown })._shapes = { ...response };
    await vi.waitFor(() => expect(drawn).toHaveLength(1));
    expect(fitted).toEqual([2]);
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
