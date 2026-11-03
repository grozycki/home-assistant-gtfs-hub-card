# GTFS Hub cards

Two dashboard cards for the [GTFS Hub](https://github.com/grozycki/home-assistant-gtfs-hub) integration: a stop board and a line map. Both have a visual editor.

## Departures

A stop board read from a departures sensor of the integration: a pinned stop's next departure sensor, or a nearest stop sensor.

```yaml
type: custom:gtfs-hub-departures-card
entity: sensor.bogucice_cmentarz_piotrowice_petla_next_departure
title: Bogucice Cmentarz
limit: 5
```

| Option | Meaning |
|---|---|
| `entity` | The sensor, required |
| `title` | Defaults to the sensor's name |
| `limit` | Departures shown, at most 5, as the sensor lists five |

Each row shows the line in its badge colours, the headsign, and the time: "now" under a minute, minutes under an hour, and the clock time after. A green dot marks live data, and a delay of a minute or more shows as `+N`, or `−N` when early. Cancelled trips are struck through. The board follows the sensor and polls nothing.

## Line map

The paths of a tracked line, as the source publishes them for today, with the vehicles on it.

```yaml
type: custom:gtfs-hub-line-map-card
entry: 01JXXXXXXXXXXXXXXXXXXXXXXX
line: "11"
route_type: 3
height: 400
```

| Option | Meaning |
|---|---|
| `entry` | The GTFS Hub source, required |
| `line` | The line's short name, required |
| `route_type` | Needed only when two modes share the name, such as a bus 11 and a tram 11 |
| `height` | In pixels, 400 by default |

The card draws on Home Assistant's own map. It uses the map's internal Leaflet layer to draw paths; if a future Home Assistant changes it, the card still shows the vehicles and says the paths cannot be drawn.

## Installation

Copy `dist/gtfs-hub-card.js` to `config/www/`, then add `/local/gtfs-hub-card.js` as a JavaScript module under Settings, Dashboards, Resources.

## Development

```bash
npm install
```

```bash
npm run check && npm test && npm run build
```

## Licence

MIT
