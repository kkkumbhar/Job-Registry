import axios from "axios";

// Use environment variable or default to localhost:3000 for development
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const dataProtectionClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default dataProtectionClient;
