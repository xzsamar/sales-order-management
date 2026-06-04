import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;