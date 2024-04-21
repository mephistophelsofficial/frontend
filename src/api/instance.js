import axios from "axios";
import { PATH } from "../consts";
import { showAlert } from "../utils";

const HOST = 'http://158.160.1.175'
const PORT = '8080'
const API = 'api';
const VERSION = 'v1'
export const API_URL = `${HOST}:${PORT}/${API}/${VERSION}`;

export const axiosInstance = axios.create({
  // withCredentials: true,
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": HOST,
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    'ngrok-skip-browser-warning': 'true' ,
  }
});

axiosInstance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem('accessJwt')}`;
  return config;
});

axiosInstance.interceptors.response.use(config => config, async error => {
  if (error.response?.data.status === 'UNAUTHORIZED') {
    showAlert(error.response?.data?.message)
    setTimeout(() => window.location.replace(PATH.LOGIN), 500);
  }
  throw error;
});