/** What a stop board shows, worked out apart from rendering so it can be tested. */

import type { Departure } from "./types";
import { strings } from "./i18n";

export const MAX_LIMIT = 5;
// A departure this long gone is hidden until the sensor drops it.
const GONE_AFTER_MS = 30_000;
const MINUTE_MS = 60_000;
const CLOCK_FROM_MINUTES = 60;
const MODE_COLOURS: Record<string, string> = { bus: "#1565C0", tram: "#C62828", trolleybus: "#2E7D32" };

export interface Row {
  line: string;
  background: string;
  text: string;
  headsign: string;
  time: string;
  live: boolean;
  delay: string | null;
  note: string | null;
  struck: boolean;
}

function modeOf(routeType: number): string {
  if (routeType === 3 || (routeType >= 700 && routeType < 800)) return "bus";
  if (routeType === 0 || (routeType >= 900 && routeType < 1000)) return "tram";
  if (routeType === 11 || (routeType >= 800 && routeType < 900)) return "trolleybus";
  return "other";
}

/** Fall back to the mode for an integration that sends no badge colours. */
function badge(departure: Departure): { background: string; text: string } {
  if (departure.line_color && departure.line_text_color) {
    return { background: departure.line_color, text: departure.line_text_color };
  }
  return { background: MODE_COLOURS[modeOf(departure.route_type)] ?? "#455A64", text: "#FFFFFF" };
}

/** The user's hour cycle: "12", "24", or the language's own for anything else. */
function hour12(timeFormat: string | undefined): { hour12?: boolean } {
  if (timeFormat === "12") return { hour12: true };
  if (timeFormat === "24") return { hour12: false };
  return {};
}

function timeLabel(
  expected: Date,
  now: Date,
  language: string,
  timeZone: string,
  timeFormat: string | undefined,
): string {
  const text = strings(language);
  const minutes = Math.floor((expected.getTime() - now.getTime()) / MINUTE_MS);
  if (minutes < 1) return text.now;
  if (minutes < CLOCK_FROM_MINUTES) return `${minutes} ${text.min}`;
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    ...hour12(timeFormat),
  }).format(expected);
}

function delayLabel(departure: Departure): string | null {
  if (departure.status !== "predicted" || departure.delay === null) return null;
  const minutes = Math.trunc(departure.delay / 60);
  if (minutes === 0) return null;
  return minutes > 0 ? `+${minutes}` : `−${-minutes}`;
}

export function rowsOf(
  departures: readonly Departure[],
  now: Date,
  limit: number,
  language: string,
  timeZone: string,
  timeFormat?: string,
): Row[] {
  const text = strings(language);
  return departures
    .filter((departure) => {
      const expected = new Date(departure.predicted ?? departure.scheduled);
      return expected.getTime() >= now.getTime() - GONE_AFTER_MS;
    })
    .slice(0, Math.min(limit, MAX_LIMIT))
    .map((departure) => {
      const expected = new Date(departure.predicted ?? departure.scheduled);
      const colours = badge(departure);
      return {
        line: departure.line,
        ...colours,
        headsign: departure.headsign ?? "",
        time: timeLabel(expected, now, language, timeZone, timeFormat),
        live: departure.status === "predicted",
        delay: delayLabel(departure),
        note:
          departure.status === "cancelled"
            ? text.cancelled
            : departure.status === "skipped"
              ? text.skipped
              : null,
        struck: departure.status === "cancelled",
      };
    });
}

/** Read the departures attribute, which comes from outside any type. */
export function departuresOf(value: unknown): Departure[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Departure =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Departure).line === "string" &&
      typeof (item as Departure).scheduled === "string",
  );
}
