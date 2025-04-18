import axios from "axios";

/*  Your Express server is listening on port 8800
    and all forum endpoints are mounted at /posts   */
export default axios.create({
  baseURL: "http://localhost:8800",
  withCredentials: true,          // sends the JWT cookie
  headers: { "Content-Type": "application/json" },
});
