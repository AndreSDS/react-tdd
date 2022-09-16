import { IUser } from "../interfaces/user";

interface ProfileCardProps {
  user: IUser;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const { id, username } = user;

  return (
    <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-4"></div>
      <div className="flex flex-col items-center pb-4">
        <img
          className="mb-3 w-24 h-24 rounded-full shadow-lg"
          src="https://ih1.redbubble.net/image.1009729670.4646/st,small,507x507-pad,600x600,f8f8f8.jpg"
          alt="user image"
        />
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          {username}
        </h5>
      </div>
    </div>
  );
};
