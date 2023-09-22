import axios from "axios";

const baseURL = "https://co-working-space-backend.onrender.com/api/v1";
export default axios.create({
  baseURL: baseURL,
});

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
