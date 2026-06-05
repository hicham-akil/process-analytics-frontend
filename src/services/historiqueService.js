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

/**
 * Récupère les données comparatives entre deux périodes.
 * 
 * @param {string} debut1 - Période 1 début
 * @param {string} fin1   - Période 1 fin
 * @param {string} debut2 - Période 2 début
 * @param {string} fin2   - Période 2 fin
 * @returns {Promise<Object>} Objet contenant les listes de points et les stats pour chaque période
 */
export async function fetchComparaison(debut1, fin1, debut2, fin2) {
  const res = await axios.get(`${API_BASE}/indicateurs/comparaison`, {
    params: {
      debut1: toApiIso(debut1),  
      fin1: toApiIso(fin1),
      debut2: toApiIso(debut2),
      fin2: toApiIso(fin2),
    },
  });
  console.log("Comparaison API response:", res.data);
  return res.data;
}

