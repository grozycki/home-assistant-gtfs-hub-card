import type { Departure, HassEntity, HomeAssistant } from "../src/types";

export const NOW = new Date("2026-11-03T16:00:00Z");

export function at(offsetSeconds: number): string {
  return new Date(NOW.getTime() + offsetSeconds * 1000).toISOString();
}

export function departure(overrides: Partial<Departure> = {}): Departure {
  return {
    line: "11",
    route_type: 3,
    line_color: "#1A1A1A",
    line_text_color: "#FFD200",
    headsign: "Piotrowice Pętla",
    scheduled: at(260),
    predicted: null,
    delay: null,
    status: "scheduled",
    ...overrides,
  };
}

export function hass(
  states: HassEntity[],
  language = "en",
  callWS: HomeAssistant["callWS"] = () => Promise.reject(new Error("no call expected")),
): HomeAssistant {
  return {
    states: Object.fromEntries(states.map((state) => [state.entity_id, state])),
    locale: { language },
    config: { time_zone: "Europe/Warsaw" },
    callWS,
  };
}

export function sensor(departures: Departure[], state = "2026-11-03T16:04:20+00:00"): HassEntity {
  return {
    entity_id: "sensor.bogucice_next_departure",
    state,
    attributes: { departures, friendly_name: "Bogucice", attribution: "Data source: GZM ZTM" },
  };
}
