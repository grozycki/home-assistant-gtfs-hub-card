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
| `title` | Defaults to the stop's name |
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

The card draws on Home Assistant's own map, through its internal map engine, or its Leaflet layer on older versions; if a future Home Assistant changes both, the card still shows the vehicles and says the paths cannot be drawn.

## Installation

The cards are not in the Marketplace catalogue yet, so add them from their repository:

[![Open your Home Assistant instance and open this repository.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=grozycki&repository=home-assistant-gtfs-hub-card&category=plugin)

1. Open the link above. Or, on Home Assistant 2026.11 or later, go to Settings, Marketplace, Add from link and enter `https://github.com/grozycki/home-assistant-gtfs-hub-card`; on 2026.10, add it in HACS as a custom repository of type Dashboard. The first custom repository makes the Marketplace connect to GitHub once, with a code you enter on github.com.
2. Install it (Download in HACS); the dashboard resource is added for you. Reload the browser.

By hand: download `home-assistant-gtfs-hub-card.js` from the [latest release](https://github.com/grozycki/home-assistant-gtfs-hub-card/releases/latest) into `config/www/`, then add `/local/home-assistant-gtfs-hub-card.js` as a JavaScript module under Settings, Dashboards, Resources.

Releases follow [Semantic Versioning](https://semver.org/) and are listed in the [changelog](CHANGELOG.md).

## Development

```bash
npm install
```

```bash
npm run check && npm test && npm run build
```

## Licence

MIT
