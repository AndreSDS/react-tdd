import { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
import { getUsers } from "../service/api";
import { PaginationButton, UserListItem } from "../components";

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
        {content.map((user) => (
          <UserListItem key={user.id} user={user} />
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
