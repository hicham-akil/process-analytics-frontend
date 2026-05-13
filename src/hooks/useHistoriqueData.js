/**
 * useHistoriqueData
 *
 * Hook React pour la consultation de l'historique des indicateurs JFC1
 * sur une période paramétrable.
 *
 * Fonctionnalités :
 *  - Plage de dates configurable (debut / fin)
 *  - Presets rapides (1h, 6h, 12h, 24h, 48h…)
 *  - Chargement asynchrone avec état loading / error
 *  - Statistiques agrégées calculées automatiquement
 */
import { useState, useCallback } from "react";
import { defaultDebut, defaultFin, presetRange } from "../utils/dateHelpers";
import { computeHistoriqueStats } from "../utils/statsHelpers";
import { fetchHistorique } from "../services/historiqueService";

export default function useHistoriqueData() {
  // ── Plage de dates ────────────────────────────────────────────
  const [debut, setDebut] = useState(defaultDebut);
  const [fin, setFin]     = useState(defaultFin);

  // ── Données & état de chargement ──────────────────────────────
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [searched, setSearched] = useState(false);

  // ── Chargement de l'historique ────────────────────────────────
  const fetch = useCallback(async () => {
    if (!debut || !fin) return;
    setLoading(true);
    setError(null);
    try {
      const sorted = await fetchHistorique(debut, fin);
      setData(sorted);
      setSearched(true);
    } catch (e) {
      setError(e.response?.data?.erreur || "Erreur lors du chargement");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [debut, fin]);

  // ── Raccourcis presets (1h, 6h, 12h, 24h…) ───────────────────
  const setPreset = useCallback((heures) => {
    const { debut: d, fin: f } = presetRange(heures);
    setDebut(d);
    setFin(f);
  }, []);

  // ── Statistiques dérivées ─────────────────────────────────────
  const stats = computeHistoriqueStats(data);

  return {
    debut, setDebut,
    fin, setFin,
    data, loading, error, searched,
    fetch, setPreset, stats,
  };
}
