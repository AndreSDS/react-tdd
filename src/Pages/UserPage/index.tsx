import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUser } from "../../interfaces/user";
import { api, getUserById } from "../../service/api";

export const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser>({} as IUser);

  async function getUser() {
    const data = await getUserById(id as string);

    if (data) {
      setUser(data.user);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div data-testid="user-page">
      <h1>User page</h1>

      <p>{user.username}</p>
    </div>
  );
};
