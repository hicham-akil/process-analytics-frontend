/**
 * Utilitaires statistiques partagés.
 * Utilisés par useHistoriqueData et potentiellement d'autres hooks.
 */

/**
 * Calcule la moyenne d'un tableau de nombres (ignore les null/undefined).
 * @param {number[]} arr
 * @returns {number|null}
 */
export function avg(arr) {
  const valid = arr.filter((x) => x != null);
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/**
 * Calcule min / max / avg pour une clé donnée dans un jeu de données.
 * @param {Object[]} data  - Tableau d'objets contenant la clé
 * @param {string}   key   - Nom du champ numérique
 * @returns {{ min: number|null, max: number|null, avg: number|null }}
 */
export function fieldStats(data, key) {
  const vals = data.map((d) => d[key]).filter((v) => v != null);
  if (!vals.length) return { min: null, max: null, avg: null };
  return {
    min: Math.min(...vals),
    max: Math.max(...vals),
    avg: avg(vals),
  };
}

/**
 * Calcule les statistiques complètes de l'historique indicateurs.
 *
 * @param {Object[]} data - Tableau trié des indicateurs
 * @returns {Object|null}  Objet stats ou null si data est vide
 */
export function computeHistoriqueStats(data) {
  if (!data.length) return null;

  return {
    rc:         fieldStats(data, "rc"),
    ri:         fieldStats(data, "ri"),
    cap:        fieldStats(data, "cap"),
    se:         fieldStats(data, "se"),
    syn:        fieldStats(data, "syn"),
    consoH2so4: fieldStats(data, "consoH2so4"),
    count:      data.length,
    alertRate:  data.filter(
      (d) =>
        (d.rc  != null && d.rc  < 0.90) ||
        (d.ri  != null && d.ri  < 0.85) ||
        (d.se  != null && d.se  > 1.5)
    ).length,
  };
}
