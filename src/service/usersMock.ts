import { IUser } from "../interfaces/user";

export const usersMock = [
  {
    id: "1",
    username: "admin",
    email: "admin@localhost",
    password: "admin",
  },
  {
    id: "2",
    username: "user",
    email: "user@localhost",
    password: "user",
  },
  {
    id: "3",
    username: "guest",
    email: "guest@localhost",
    password: "guest",
  },
  {
    id: "4",
    username: "andré",
    email: "andre@gmail.com",
    password: "123456",
  },
  {
    id: "5",
    username: "bárbara",
    email: "barbara@gmail.com",
    password: "123456",
  },
  {
    id: "6",
    username: "carlos",
    email: "carlos@gmail.com",
    password: "123456",
  },
  {
    id: "7",
    username: "daniel",
    email: "daniel#email.com",
    password: "123456",
  },
];

export const getPage = (page: number, size: number, content: IUser[]) => {
  const start = Number(page) * Number(size);
  const end = start + size;

  const totalPages = Math.ceil(content.length / size);

  return {
    content: content.slice(start, end),
    page,
    size,
    totalPages,
  };
};
