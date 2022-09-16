import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgressIndicator } from "../../components";
import { ProfileCard } from "../../components/ProfileCard";
import { IUser } from "../../interfaces/user";
import { getUserById } from "../../service/api";

export const UserPage = (props: any) => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser>({} as IUser);

  async function getUser() {
    const data = await getUserById(`${id}`);

    if (data?.data) {
      setUser(data?.data.user);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div data-testid="user-page">
      {!!user.username ? <ProfileCard user={user} /> : <ProgressIndicator />}
    </div>
  );
};
