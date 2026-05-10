/**
 * Service API dédié à l'historique des indicateurs.
 * Centralise les appels HTTP liés à /indicateurs/periode.
 */
import axios from "axios";
import { API_BASE } from "../config/seuils";
import { toApiIso } from "../utils/dateHelpers";

/**
 * Récupère les indicateurs sur une période donnée,
 * triés du plus récent au plus ancien.
 *
 * @param {string} debut - datetime-local (YYYY-MM-DDTHH:mm)
 * @param {string} fin   - datetime-local (YYYY-MM-DDTHH:mm)
 * @returns {Promise<Object[]>} Tableau d'indicateurs triés
 * @throws {Error} Avec le message d'erreur backend ou un message par défaut
 */
export async function fetchHistorique(debut, fin) {
  const res = await axios.get(`${API_BASE}/indicateurs/periode`, {
    params: {
      debut: toApiIso(debut),
      fin:   toApiIso(fin),
    },
  });

  const sorted = [...(res.data || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return sorted;
}
