import { IUser } from "../interfaces/user";
import { api } from "../service/api";

export const useAuth = () => {
  async function getAllUsers() {
    const response = await api.get("/users");
    return response.data;
  }

  async function getUser(name: string): Promise<IUser> {
    if (!name) {
      console.error("Name is required");
      return null as any;
    }
    const user = await api.get(`/users/${name}`);
    return user.data as IUser;
  }

  async function createUser(user: IUser): Promise<void> {
    if (!user) {
      console.error("User is required");
      return null as any;
    }
    await api.post("/users", user);
    const userCreated = await api.get(`/users/${user.username}`);
    console.log("User created", userCreated);
  }

  async function login(data: IUser): Promise<void> {
    const user = await getUser(data.username);

    if (user.password === data.password && user.username === data.username) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  return {
    createUser,
    getAllUsers,
    getUser,
    login,
  };
};
