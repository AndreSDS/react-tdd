import axios from "axios";
import { IUser } from "../interfaces/user";
import i18n from "../locale/i18n";
import { getItem } from "../utils/storage";

export const api = axios.create({
  baseURL: "http://127.0.0.1:5173/api",
});

api.interceptors.request.use((request) => {
  const { header } = getItem("auth");
  if (request.headers) {
    request.headers.AcceptLanguage = i18n.language;
  }

  if (request.headers && header) {
    request.headers.Authorization = header;
  }
  return request;
});

export const getUsers = async (page: number) => {
  try {
    const { data } = await api.get("/users", {
      params: {
        page,
        size: 3,
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (id: string) => {
  const data: IUser = await api.get(`/users/${id}`);
  return data;
};

export const loginUser = async (body: { email: string; password: string }) => {
  const data = await api.post("/auth", body);
  return data;
};

export const updateUser = async (id: string, body: any) => {
  const data = await api.put(`/users/${id}`, body);
  return data;
};

export const logoutUser = async () => {
  const data = await api.post("/logout");
  return data;
};
