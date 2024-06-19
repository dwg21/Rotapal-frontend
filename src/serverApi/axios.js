import axios from "axios";

axios.defaults.withCredentials = true;
// baseURL:'http://localhost:5000/'

const ServerApi = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/",
});

export default ServerApi;
