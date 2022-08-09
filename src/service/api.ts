import axios from "axios";
console.log("chamou api");
export const api = axios.create({
  baseURL: "http://localhost:5173/api",
});
