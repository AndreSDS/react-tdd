import axios from "axios";
import { IUser } from "../interfaces/user";
import i18n from "../locale/i18n";
import { getItem } from "../utils/storage";

export const api = axios.create({
  baseURL: "http://127.0.0.1:5173/api",
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
  const data = await api.post("/auth", body, {
    headers: {
      "Accept-Language": i18n.language,
    },
  });

  return data;
};

export const updateUser = async (id: string, body: any) => {
  const { header } = getItem("auth");
  const data = await api.put(`/users/${id}`, body, {
    headers: {
      Authorization: header,
    },
  });
  return data;
};
