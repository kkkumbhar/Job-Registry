import axios from "axios";

// Prefer explicit API base URL, then API host URL, then local backend default.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiUrl = import.meta.env.VITE_API_URL;

const baseURL = apiBaseUrl
    || (apiUrl ? `${apiUrl.replace(/\/$/, "")}/api` : undefined)
    || "http://localhost:3001/api";

const dataProtectionClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default dataProtectionClient;
