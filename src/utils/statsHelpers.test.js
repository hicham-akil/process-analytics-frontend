import test from "node:test";
import assert from "node:assert/strict";

import {
  avg,
  computeHistoriqueStats,
  fieldStats,
} from "./statsHelpers.js";

test("avg ignores null and undefined values", () => {
  assert.equal(avg([10, null, 20, undefined, 30]), 20);
});

test("avg returns null when no numeric value is available", () => {
  assert.equal(avg([null, undefined]), null);
});

test("fieldStats returns min, max and average for a field", () => {
  assert.deepEqual(
    fieldStats([{ rc: 0.92 }, { rc: null }, { rc: 0.88 }, { rc: 0.95 }], "rc"),
    { min: 0.88, max: 0.95, avg: 0.9166666666666666 },
  );
});

test("computeHistoriqueStats returns null for empty data", () => {
  assert.equal(computeHistoriqueStats([]), null);
});

test("computeHistoriqueStats counts rows and low-yield alerts", () => {
  const stats = computeHistoriqueStats([
    { rc: 0.91, ri: 0.86, cap: 1.5 },
    { rc: 0.89, ri: 0.88, cap: 1.7 },
    { rc: 0.94, ri: 0.84, cap: 1.6 },
  ]);

  assert.equal(stats.count, 3);
  assert.equal(stats.alertRate, 2);
  assert.equal(stats.cap.min, 1.5);
  assert.equal(stats.cap.max, 1.7);
  assert.ok(Math.abs(stats.cap.avg - 1.6) < Number.EPSILON * 2);
});
