import { FormEvent, HTMLAttributes, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../interfaces/user";
import { getItem } from "../utils/storage";
import { Input, ButtonWithProgress } from "../components";
import { updateUser } from "../service/api";
import { useTranslation } from "react-i18next";

interface ProfileCardProps {
  user: IUser;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const { t } = useTranslation();
  const { id, username } = user;
  // const authUser = JSON.parse(getItem("auth")) || {};
  const { auth, authLogin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);

  const updateName = async () => {
    setLoading(true);

    if (usernameInput === username) {
      setLoading(false);
      setIsEditing(false);
      return;
    }

    try {
      authLogin({ ...auth, username: usernameInput });
      await updateUser(id, { username: usernameInput });
      setLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-4">
        <img
          className="mb-3 w-24 h-24 rounded-full shadow-lg"
          src="https://ih1.redbubble.net/image.1009729670.4646/st,small,507x507-pad,600x600,f8f8f8.jpg"
          alt="user image"
        />

        {!isEditing && (
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            {username}
          </h5>
        )}

        {id === auth.id && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            {t("edit")}
          </button>
        )}

        {isEditing && (
          <div className="w-60">
            <Input
              id="username"
              value={username}
              placeholder="Change your username"
              type="text"
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            <div className="flex items-center justify-between w-full">
              <ButtonWithProgress
                disabled={loading}
                loading={loading}
                title={t("save")}
                handleClick={updateName}
              />

              <button
                onClick={() => setIsEditing(false)}
                className="flex 
                focus:outline-none 
                text-white 
                bg-red-700 hover:bg-red-800 
                focus:ring-4 focus:ring-red-300 
                font-bold rounded-lg py-2 px-4 dark:bg-red-600 
                dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
