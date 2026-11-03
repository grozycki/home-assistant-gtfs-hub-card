/** The parts of Home Assistant's frontend objects the cards read. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  locale?: { language: string };
  language?: string;
  config: { time_zone: string };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

/** One departure as the integration lists it. */
export interface Departure {
  line: string;
  route_type: number;
  line_color?: string;
  line_text_color?: string;
  headsign: string | null;
  scheduled: string;
  predicted: string | null;
  delay: number | null;
  status: "scheduled" | "predicted" | "cancelled" | "skipped";
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: object): void;
}
