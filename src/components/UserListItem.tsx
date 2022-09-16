import { IUser } from "../interfaces/user";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface UserListItemProps {
  user: IUser;
}

export const UserListItem = ({ user }: UserListItemProps) => {
  const { id, username } = user;

  return (
    <Link to={`/user/${id}`}>
      <li className="flex items-center p-2 mb-4 bg-gray-100 rounded-lg shadow-sm dark:bg-zync-700">
        <img
          className="w-8 h-8 rounded-full"
          src="https://ih1.redbubble.net/image.1009729670.4646/st,small,507x507-pad,600x600,f8f8f8.jpg"
          alt="profile user image"
        />
        {username}
      </li>
    </Link>
  );
};
