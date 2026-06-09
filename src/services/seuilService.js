import axios from "axios";
import { API_BASE } from "../config/seuils";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token || window.__authToken || ""}`,
  },
});

export async function getSeuilsApi(token) {
  const res = await axios.get(`${API_BASE}/seuils`, authConfig(token));
  return res.data;
}

export async function updateSeuilApi(code, payload, token) {
  const res = await axios.put(`${API_BASE}/seuils/${code}`, payload, authConfig(token));
  return res.data;
}
