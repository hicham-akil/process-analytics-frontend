/**
 * Utilitaires de dates partagés.
 * Gestion des plages par défaut et des presets rapides.
 */

/**
 * Retourne un datetime-local (YYYY-MM-DDTHH:mm) pour « maintenant – N heures ».
 * @param {number} hoursAgo - Nombre d'heures dans le passé (défaut 24)
 * @returns {string}
 */
export function defaultDebut(hoursAgo = 24) {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString().slice(0, 16);
}

/**
 * Retourne un datetime-local pour l'instant présent.
 * @returns {string}
 */
export function defaultFin() {
  return new Date().toISOString().slice(0, 16);
}

/**
 * Convertit un datetime-local en ISO sans le "Z" final
 * (format attendu par le backend Spring Boot).
 * @param {string} localDatetime - Ex. "2026-05-10T14:30"
 * @returns {string}
 */
export function toApiIso(localDatetime) {
  return new Date(localDatetime).toISOString().split(".")[0];
}

/**
 * Génère une paire { debut, fin } pour un preset de N heures.
 * @param {number} heures
 * @returns {{ debut: string, fin: string }}
 */
export function presetRange(heures) {
  const now = new Date();
  const from = new Date(now.getTime() - heures * 60 * 60 * 1000);
  return {
    debut: from.toISOString().slice(0, 16),
    fin:   now.toISOString().slice(0, 16),
  };
}
