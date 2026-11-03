/** Register both cards, and list them in the card picker. */

import { GtfsHubDeparturesCard, GtfsHubDeparturesCardEditor } from "./departures-card";
import { GtfsHubLineMapCard, GtfsHubLineMapCardEditor } from "./line-map-card";

const elements: [string, CustomElementConstructor][] = [
  ["gtfs-hub-departures-card", GtfsHubDeparturesCard],
  ["gtfs-hub-departures-card-editor", GtfsHubDeparturesCardEditor],
  ["gtfs-hub-line-map-card", GtfsHubLineMapCard],
  ["gtfs-hub-line-map-card-editor", GtfsHubLineMapCardEditor],
];
for (const [name, element] of elements) {
  if (!customElements.get(name)) customElements.define(name, element);
}

interface CustomCard {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
}
const registry = window as { customCards?: CustomCard[] };
registry.customCards ??= [];
registry.customCards.push(
  {
    type: "gtfs-hub-departures-card",
    name: "GTFS Hub departures",
    description: "A stop board with live delays.",
    preview: true,
  },
  {
    type: "gtfs-hub-line-map-card",
    name: "GTFS Hub line map",
    description: "The paths of a tracked line with its vehicles.",
  },
);
