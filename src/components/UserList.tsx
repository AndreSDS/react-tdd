import { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
import { getUsers } from "../service/api";
import {
  PaginationButton,
  UserListItem,
  ProgressIndicator,
} from "../components";
import { useTranslation } from "react-i18next";

export const UserList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState({
    content: [] as IUser[],
    page: 0,
    size: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const { content, page, totalPages } = users ?? {};

  async function loadData() {
    if (content.length === 0) {
      setLoading(true);
      const data = await getUsers(0);
      setUsers(data);
      setLoading(false);
    }
  }

  async function loadNextPage(page: number) {
    setLoading(true);
    const data = await getUsers(page);
    setUsers(data);
    setLoading(false);
  }

  async function loadPrevPage(page: number) {
    setLoading(true);
    const data = await getUsers(page);
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 m-auto w-4/5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-zync-800 dark:border-zync-700">
      <h1>{t("users")}</h1>
      {loading ? (
        <div className="w-full py-4 px-4 flex justify-center align-middle">
          <ProgressIndicator />
        </div>
      ) : (
        <ul>
          {content?.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </ul>
      )}

      <div className="w-full flex align-middle justify-between">
        {page > 0 && (
          <PaginationButton
            textButton={t("previousPage")}
            handleClick={() => loadPrevPage(page - 1)}
          />
        )}
        {totalPages > page + 1 && (
          <PaginationButton
            textButton={t("nextPage")}
            handleClick={() => loadNextPage(page + 1)}
          />
        )}
      </div>
    </div>
  );
};
