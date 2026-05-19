import axios from "axios";
import { API_BASE } from "../config/seuils";

export async function loginApi(username, password) {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  return res.data;
}