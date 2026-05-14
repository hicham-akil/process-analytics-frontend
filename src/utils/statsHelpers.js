export function avg(arr) {
  const valid = arr.filter((x) => x != null);
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export function fieldStats(data, key) {
  const vals = data.map((d) => d[key]).filter((v) => v != null);
  if (!vals.length) return { min: null, max: null, avg: null };
  return {
    min: Math.min(...vals),
    max: Math.max(...vals),
    avg: avg(vals),
  };
}

export function computeHistoriqueStats(data) {
  if (!data.length) return null;

  return {
    rc:           fieldStats(data, "rc"),
    ri:           fieldStats(data, "ri"),
    cap:          fieldStats(data, "cap"),
    consoH2so4:   fieldStats(data, "consoH2so4"),
    consoEauBrute:    fieldStats(data, "consoEauBrute"),
    consoPhosphates:  fieldStats(data, "consoPhosphates"),
    consoVapeur:      fieldStats(data, "consoVapeur"),
    count:        data.length,
    alertRate:    data.filter(
      (d) =>
        (d.rc != null && d.rc < 0.90) ||
        (d.ri != null && d.ri < 0.85)
    ).length,
  };
}