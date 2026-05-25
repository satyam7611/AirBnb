import axios from 'axios';

const getBaseUrl = () => {
  // 1. If an environment variable is set (Vercel production/staging), always use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 2. Client-side local development check (Wi-Fi debugging for mobile/tablet)
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8081`;
  }
  
  // 3. Server-side local development fallback
  return 'http://localhost:8081';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

export default api;
