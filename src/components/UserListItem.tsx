import { IUser } from "../interfaces/user";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface UserListItemProps {
  user: IUser;
}

export const UserListItem = ({ user }: UserListItemProps) => {
  const { t } = useTranslation();
  const { id, username } = user;

  return (
    <li className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-sm dark:bg-zync-700">
      <Link to={`/user/${id}`}>{t("user")}: {username}</Link>
    </li>
  );
};
