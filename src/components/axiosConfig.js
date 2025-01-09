import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fire-alarm-systems-back-end.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
