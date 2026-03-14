import axios from 'axios';

const API_URL = Buffer.from('aHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaQ==', 'base64').toString(); // http://localhost:3001/api

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
