import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/action/logout";

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  timeout: 500000,
 
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authorization");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 406) {
      // Logout the user here
      // Example: clear local storage or perform logout action
      localStorage.clear();
      store.dispatch(logout());
      // Redirect the user to the login page or perform any other action
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body, config) => instance.post(url, body, config).then(responseBody),

  put: (url, body, config) =>
    instance.put(url, body, config).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url) => instance.delete(url).then(responseBody),
};

export default requests;
