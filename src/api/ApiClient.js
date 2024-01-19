import axios from "axios";
import { logOut } from "../redux/auth/authSlice";
import store from "../redux/store";

const base_url = process.env.REACT_APP_API_BASE_URL;

const ApiClient =  () => {
  
  const axiosInstance = axios.create({
    baseURL: base_url,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
  });

  axiosInstance.interceptors.request.use(
    config => {
      const _token = localStorage.getItem("_token");
      if (_token) {
        config.headers.Authorization = `Bearer ${_token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
          store.dispatch(logOut());
      } 
      return Promise.reject(error);
    }
  )

  return axiosInstance;
}

export default ApiClient();
