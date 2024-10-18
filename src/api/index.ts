import axios from "axios";
import { useToastStore } from "../stores/toast-store";

let toastStore: any = null;

const instance = axios.create({
  baseURL: "http://192.168.12.19:18680",
  timeout: 5000,
});

export interface CommonResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

export interface Page<T> {
  count: number;
  
  list: T[];
}

// Alter defaults after instance has been created
instance.defaults.headers.common["Authorization"] = "";

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (toastStore === null) {
      toastStore = useToastStore();
    }
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.code !== 200) {
      if (response.data.message !== undefined) {
        toastStore.showToast(response.data.message, "info");
      }
      if (response.data.msg !== undefined)
        toastStore.showToast(response.data.msg, "info");
    }
    return response;
  },
  function (error) {
    if (toastStore === null) {
      toastStore = useToastStore();
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    toastStore.showToast(error, "info");
    return Promise.reject(error);
  },
);

export default instance;
