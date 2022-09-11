import React, { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
import { api } from "../service/api";

export const UserList = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  async function getUsers() {
    try {
      const { data } = await api.get("/users", {
        params: {
          page: 0,
          size: 3,
        },
      });
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="p-6 m-auto w-4/5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-zync-800 dark:border-zync-700">
      <h1>Users</h1>
      <ul>
        {users.map(({ id, username }) => (
          <li
            key={id}
            className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-sm dark:bg-zync-700"
          >
            User: {username}
          </li>
        ))}
      </ul>
    </div>
  );
};
