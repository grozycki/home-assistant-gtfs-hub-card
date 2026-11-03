import { describe, expect, it } from "vitest";

import { departuresOf, rowsOf } from "../src/board";
import { NOW, at, departure } from "./fixtures";

const rows = (items = [departure()], language = "en") => rowsOf(items, NOW, 5, language, "Europe/Warsaw");

describe("time", () => {
  it("counts minutes when soon", () => {
    expect(rows()[0]?.time).toBe("4 min");
  });

  it("reads now under a minute, in Polish too", () => {
    expect(rows([departure({ scheduled: at(40) })])[0]?.time).toBe("now");
    expect(rows([departure({ scheduled: at(40) })], "pl")[0]?.time).toBe("teraz");
  });

  it("shows the local clock later", () => {
    // 16:00 UTC is 17:00 in Warsaw in November.
    expect(rows([departure({ scheduled: at(75 * 60) })], "pl")[0]?.time).toBe("18:15");
  });

  it("hides departures gone for more than 30 s", () => {
    expect(rows([departure({ scheduled: at(-45) }), departure({ scheduled: at(-20) })])).toHaveLength(1);
  });

  it("uses the prediction over the schedule", () => {
    const late = departure({ scheduled: at(-120), predicted: at(70), delay: 190, status: "predicted" });
    expect(rows([late])[0]?.time).toBe("1 min");
  });
});

describe("live data", () => {
  it("marks a prediction and its delay", () => {
    const [row] = rows([departure({ predicted: at(450), delay: 190, status: "predicted" })]);
    expect(row?.live).toBe(true);
    expect(row?.delay).toBe("+3");
  });

  it("shows an early departure with a minus", () => {
    expect(rows([departure({ predicted: at(200), delay: -90, status: "predicted" })])[0]?.delay).toBe(
      "−1",
    );
  });

  it("shows nothing for the schedule alone or a small delay", () => {
    const [scheduled, onTime] = rows([
      departure(),
      departure({ predicted: at(300), delay: 40, status: "predicted" }),
    ]);
    expect(scheduled?.live).toBe(false);
    expect(scheduled?.delay).toBeNull();
    expect(onTime?.live).toBe(true);
    expect(onTime?.delay).toBeNull();
  });
});

describe("rows", () => {
  it("strikes cancelled trips and labels skipped stops", () => {
    const [cancelled, skipped] = rows(
      [departure({ status: "cancelled" }), departure({ status: "skipped" })],
      "pl",
    );
    expect(cancelled).toMatchObject({ struck: true, note: "odwołany" });
    expect(skipped).toMatchObject({ struck: false, note: "nie zatrzymuje się" });
  });

  it("caps the limit at five", () => {
    expect(rowsOf(Array(8).fill(departure()), NOW, 20, "en", "Europe/Warsaw")).toHaveLength(5);
  });

  it("takes badge colours from the integration, or the mode without them", () => {
    expect(rows()[0]).toMatchObject({ background: "#1A1A1A", text: "#FFD200" });
    const { line_color: _a, line_text_color: _b, ...bare } = departure({ route_type: 0 });
    expect(rows([bare])[0]).toMatchObject({ background: "#C62828", text: "#FFFFFF" });
  });

  it("reads only well-formed departures from an attribute", () => {
    expect(departuresOf([departure(), { line: 5 }, null, "x"])).toHaveLength(1);
    expect(departuresOf(undefined)).toEqual([]);
  });
});
