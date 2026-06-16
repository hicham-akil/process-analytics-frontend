import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SEUILS_NIVEAUX,
  buildSimpleSeuils,
  seuilsListToNiveaux,
} from "../config/seuils";
import { getSeuilsApi, updateSeuilApi } from "../services/seuilService";
import { useAuth } from "./AuthContext";

const SeuilsContext = createContext(null);

export function SeuilsProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [seuilsNiveaux, setSeuilsNiveaux] = useState(DEFAULT_SEUILS_NIVEAUX);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const data = await getSeuilsApi();
      setItems(data);
      setSeuilsNiveaux(seuilsListToNiveaux(data));
    } catch (err) {
      console.error("Erreur chargement seuils:", err);
      setError("Impossible de charger les seuils. Les valeurs par defaut sont utilisees.");
    } finally {
      setLoading(false);
    }
  };

  const updateSeuil = async (code, payload) => {
    const saved = await updateSeuilApi(code, payload);
    const nextItems = items.some(item => item.code === code)
      ? items.map(item => item.code === code ? saved : item)
      : [...items, saved];

    setItems(nextItems);
    setSeuilsNiveaux(seuilsListToNiveaux(nextItems));
    return saved;
  };

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  return (
    <SeuilsContext.Provider value={{
      items,
      seuilsNiveaux,
      seuils: buildSimpleSeuils(seuilsNiveaux),
      loading,
      error,
      refresh,
      updateSeuil,
    }}>
      {children}
    </SeuilsContext.Provider>
  );
}

export function useSeuils() {
  const ctx = useContext(SeuilsContext);
  if (!ctx) throw new Error("useSeuils must be inside SeuilsProvider");
  return ctx;
}
