import { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
import { api, getUsers } from "../service/api";
import { PaginationButton } from "../components";

export const UserList = () => {
  const [users, setUsers] = useState({
    content: [] as IUser[],
    page: 0,
    size: 0,
    totalPages: 0,
  });

  const { content, page, totalPages, size } = users;

  async function loadData() {
    const data = await getUsers(0);
    setUsers(data);
  }

  async function loadNextPage(page: number) {
    const data = await getUsers(page);
    setUsers(data);
  }

  async function loadPrevPage(page: number) {
    const data = await getUsers(page);
    setUsers(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 m-auto w-4/5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-zync-800 dark:border-zync-700">
      <h1>Users</h1>
      <ul>
        {content.map(({ id, username }) => (
          <li
            key={id}
            className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-sm dark:bg-zync-700"
          >
            User: {username}
          </li>
        ))}
      </ul>

      {totalPages > page + 1 && (
        <PaginationButton
          textButton="next"
          handleClick={() => loadNextPage(page + 1)}
        />
      )}
      
      {page > 0 && (
        <PaginationButton
          textButton="previous"
          handleClick={() => loadPrevPage(page - 1)}
        />
      )}
    </div>
  );
};
