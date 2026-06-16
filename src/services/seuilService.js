import axios from "axios";
import { API_BASE } from "../config/seuils";

export async function getSeuilsApi() {
  const res = await axios.get(`${API_BASE}/seuils`);
  return res.data;
}

export async function updateSeuilApi(code, payload) {
  const res = await axios.put(`${API_BASE}/seuils/${code}`, payload);
  return res.data;
}
