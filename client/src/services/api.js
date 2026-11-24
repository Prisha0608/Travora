import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT token to every request (used from Step 2 onward)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.startsWith("/auth/");

    // Expired/invalid token on a normal request: log out and go to login
    if (
      error.response?.status === 401 &&
      !isAuthCall &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;