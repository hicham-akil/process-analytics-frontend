import axios from "axios";
import { API_BASE } from "../config/seuils";

export async function createPerte(data) {
  const res = await axios.post(`${API_BASE}/ingest/perte`, data);
  return res.data;
}

export async function fetchDernierPerte() {
  const res = await axios.get(`${API_BASE}/ingest/perte/dernier`);
  return res.data;
}

export async function fetchHistoriquePerte() {
  const res = await axios.get(`${API_BASE}/ingest/perte/historique`);
  return res.data;
}
