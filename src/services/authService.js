import axios from "axios";
import { API_BASE } from "../config/seuils";

export async function loginApi(username, password) {
  const res = await axios.post(
    `${API_BASE}/auth/login`,
    { username, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function logoutApi() {
  await axios.post(`${API_BASE}/auth/logout`, null, { withCredentials: true });
}

export async function createUserApi(user) {
  const res = await axios.post(`${API_BASE}/admin/users`, user, { withCredentials: true });
  return res.data;
}
