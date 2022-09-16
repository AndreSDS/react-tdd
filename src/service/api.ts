import axios from "axios";
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
  try {
    const data = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
