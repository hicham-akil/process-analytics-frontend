  
export const API_BASE = "http://localhost:8080/api";
export const WS_URL   = "http://localhost:8080/api/ws-jfc1";


export const SEUILS_NIVEAUX = {
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

// Seuils simples (pour compatibilité / affichage rapide)
export const SEUILS = Object.fromEntries(
  Object.entries(SEUILS_NIVEAUX).map(([key, { type, critique }]) => [
    key,
    type === "max" ? { max: critique } : { min: critique },
  ])
);

/**
 * Retourne null | "warning" | "critique"
 */
export const getNiveau = (key, value) => {
  if (value == null) return null;
  const s = SEUILS_NIVEAUX[key];
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

/** true si hors seuil */
export const isEnAlerte = (key, value) => getNiveau(key, value) != null;

/**
 * Couleur Tailwind selon le niveau
 * Usage: <td className={couleurNiveau(getNiveau("rc", val))}>
 */
export const couleurNiveau = (niveau) => {
  if (niveau === "critique") return "bg-red-100 text-red-700 font-semibold";
  if (niveau === "warning")  return "bg-yellow-100 text-yellow-700";
  return "";
};

/** Formate une valeur numérique */
export const fmt = (v, decimals = 4) =>
  v != null ? Number(v).toFixed(decimals) : "—";