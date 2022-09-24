import { useEffect, useState } from "react";
import { CustomAlert, ProgressIndicator } from "../../components";
import { ProfileCard } from "../../components/ProfileCard";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../interfaces/user";
import { getUserById } from "../../service/api";

export const UserPage = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState<IUser>({} as IUser);
  const [error, setError] = useState<{ message: string }>({ message: "" });

  async function getUser() {
    try {
      const data: any = await getUserById(`${auth.id}`);
      setUser(data.data.user);
    } catch (error: any) {
      setError(error.response.data);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const { username } = user;
  const { message } = error;

  const Content = () => {
    if (username) {
      return <ProfileCard user={user} />;
    } else if (message) {
      return <CustomAlert message={message} type="error" />;
    } else {
      return <ProgressIndicator />;
    }
  };

  return (
    <div data-testid="user-page">
      <Content />
    </div>
  );
};
