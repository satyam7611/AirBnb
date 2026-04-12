import axios from 'axios';

// Dynamically use the current device's hostname to hit the Express API 
// This fixes Network Errors when using tablets/phones on the same Wi-Fi!
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8081`;
  }
  return 'http://localhost:8081';
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || getBaseUrl(),
  withCredentials: true,
});

export default api;
