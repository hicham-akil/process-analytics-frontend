import test from "node:test";
import assert from "node:assert/strict";

import { defaultDebut, defaultFin, presetRange, toApiIso } from "./dateHelpers.js";

const datetimeLocalPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

test("defaultFin returns a datetime-local value", () => {
  assert.match(defaultFin(), datetimeLocalPattern);
});

test("defaultDebut returns a datetime-local value", () => {
  assert.match(defaultDebut(6), datetimeLocalPattern);
});

test("toApiIso converts datetime-local values to seconds precision", () => {
  assert.match(toApiIso("2026-06-11T10:30"), /^\d{4}-\d{2}-\d{2}T\d{2}:30:00$/);
});

test("presetRange returns an ordered datetime-local range", () => {
  const range = presetRange(2);

  assert.match(range.debut, datetimeLocalPattern);
  assert.match(range.fin, datetimeLocalPattern);
  assert.ok(range.debut <= range.fin);
});
