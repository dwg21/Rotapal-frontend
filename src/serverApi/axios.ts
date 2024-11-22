import axios, { AxiosInstance } from "axios";

axios.defaults.withCredentials = true;

const ServerApi: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/",
});

export default ServerApi;
