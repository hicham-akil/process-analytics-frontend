import { useState, useCallback } from "react";
import { defaultDebut, defaultFin, presetRange } from "../utils/dateHelpers";
import { computeHistoriqueStats } from "../utils/statsHelpers";
import { fetchHistorique } from "../services/historiqueService";

export default function useHistoriqueData() {
  const [debut, setDebut] = useState(() => defaultDebut(24));
  const [fin,   setFin]   = useState(() => defaultFin());

  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [searched, setSearched] = useState(false);

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

  const setPreset = useCallback((heures) => {
    const { debut: d, fin: f } = presetRange(heures);
    setDebut(d);
    setFin(f);
  }, []);

  const stats = computeHistoriqueStats(data);

  return {
    debut, setDebut,
    fin,   setFin,
    data, loading, error, searched,
    fetch, setPreset, stats,
  };
}