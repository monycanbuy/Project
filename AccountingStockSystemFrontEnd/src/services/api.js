import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (userData) => {
  const response = await API.post("/signup", userData);
  return response.data;
};

export const signin = async (userData) => {
  const response = await API.post("/signin", userData);
  return response.data.message;
};
