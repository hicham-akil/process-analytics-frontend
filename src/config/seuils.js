export const API_BASE = "/api";
export const WS_URL = "/api/ws-jfc1";

export const DEFAULT_SEUILS_NIVEAUX = {
  se:              { type: "max", warning: 0.60,  critique: 0.90  },
  syn:             { type: "max", warning: 0.78,  critique: 0.86  },
  intVal:          { type: "max", warning: 0.21,  critique: 0.23  },
  rc:              { type: "min", warning: 0.93,  critique: 0.90  },
  ri:              { type: "min", warning: null,  critique: 0.80  },
  consoH2so4:      { type: "max", warning: null,  critique: 3.8   },
  consoEauBrute:   { type: "max", warning: null,  critique: 15.0  },
  consoPhosphates: { type: "max", warning: 3.5,   critique: 4.2   },
  consoVapeur:     { type: "max", warning: 1.2,   critique: 1.5   },
  cap:             { type: "max", warning: null,  critique: 2.0   },
  p2o5Gypse:       { type: "max", warning: null,  critique: 3.5   },
  caOGypse:        { type: "max", warning: null,  critique: 33.0  },
  p2o5Phosphate:   { type: "min", warning: null,  critique: 27.0  },
  caOPhosphate:    { type: "min", warning: null,  critique: 39.0  },
};

export const SEUILS_NIVEAUX = DEFAULT_SEUILS_NIVEAUX;

export const buildSimpleSeuils = (seuilsNiveaux = DEFAULT_SEUILS_NIVEAUX) =>
  Object.fromEntries(
    Object.entries(seuilsNiveaux).map(([key, { type, critique }]) => [
      key,
      type === "max" ? { max: critique } : { min: critique },
    ])
  );

export const seuilsListToNiveaux = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return DEFAULT_SEUILS_NIVEAUX;

  return items.reduce((acc, item) => {
    if (!item?.code) return acc;
    acc[item.code] = {
      type: String(item.type || "MAX").toLowerCase(),
      warning: item.warning ?? null,
      critique: item.critique,
      label: item.label,
      updatedAt: item.updatedAt,
    };
    return acc;
  }, { ...DEFAULT_SEUILS_NIVEAUX });
};

// Simple thresholds kept for backwards compatibility.
export const SEUILS = buildSimpleSeuils(DEFAULT_SEUILS_NIVEAUX);

export const getNiveauFrom = (seuilsNiveaux, key, value) => {
  if (value == null) return null;
  const s = seuilsNiveaux[key];
  if (!s) return null;

  if (s.type === "max") {
    if (value > s.critique) return "critique";
    if (s.warning != null && value > s.warning) return "warning";
    return null;
  }

  if (s.type === "min") {
    if (value < s.critique) return "critique";
    if (s.warning != null && value < s.warning) return "warning";
    return null;
  }

  return null;
};

export const getNiveau = (key, value) => getNiveauFrom(DEFAULT_SEUILS_NIVEAUX, key, value);

export const isEnAlerte = (key, value) => getNiveau(key, value) != null;

export const couleurNiveau = (niveau) => {
  if (niveau === "critique") return "text-accent-red font-semibold";
  if (niveau === "warning") return "text-accent-amber";
  return "text-text-secondary";
};

export const fmt = (v, decimals = 4) =>
  v != null ? Number(v).toFixed(decimals) : "-";
