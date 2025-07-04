import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://chatrix-49uu.onrender.com/api',
  withCredentials: true,
});
