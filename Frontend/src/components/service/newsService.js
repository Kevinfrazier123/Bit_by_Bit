import axios from "axios";

// Fall back to localhost:8800 so we know where it’s really going
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8800";

console.log("🛰️  NewsService is pointing at:", API_BASE);

export function fetchCyberAttackNews(page = 1) {
  return axios.get(`${API_BASE}/news`, {
    params: { page },
  });
}
