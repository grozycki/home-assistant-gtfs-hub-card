/** Strings in English and Polish, chosen by the user's language. */

const STRINGS = {
  en: {
    now: "now",
    min: "min",
    cancelled: "cancelled",
    skipped: "does not stop",
    none: "No departures",
    unavailable: "Unavailable",
    live: "Live",
    noPaths: "The map cannot draw paths in this version of Home Assistant.",
    entity: "Departures sensor",
    title: "Title",
    limit: "Departures shown",
    entry: "Source",
    line: "Line",
    routeType: "Route type",
    height: "Height in pixels",
  },
  pl: {
    now: "teraz",
    min: "min",
    cancelled: "odwołany",
    skipped: "nie zatrzymuje się",
    none: "Brak odjazdów",
    unavailable: "Niedostępne",
    live: "Na żywo",
    noPaths: "Mapa w tej wersji Home Assistanta nie umie narysować tras.",
    entity: "Sensor odjazdów",
    title: "Tytuł",
    limit: "Liczba odjazdów",
    entry: "Źródło",
    line: "Linia",
    routeType: "Typ trasy",
    height: "Wysokość w pikselach",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

export function strings(language: string | undefined): Record<StringKey, string> {
  return language?.toLowerCase().startsWith("pl") ? STRINGS.pl : STRINGS.en;
}
