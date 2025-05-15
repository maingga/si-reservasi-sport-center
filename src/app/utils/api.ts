import axios from 'axios';

// URL dasar untuk backend Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ganti dengan URL API backend kamu
});

// Intercept request untuk menambahkan token auth jika pengguna sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Sesuaikan dengan tempat penyimpanan token kamu
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export { api };
