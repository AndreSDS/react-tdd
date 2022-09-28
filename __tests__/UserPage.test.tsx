import React from "react";
import { cleanup, render, screen, waitFor } from "../src/test/setup";
import { usersMock } from "../src/service/usersMock";

import { UserPage } from "../src/Pages/UserPage";
import { api } from "../src/service/api";
import { IUser } from "../src/interfaces/user";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "1",
  }),
}));

let counter = 0;
const setup = () => {
  api.get = jest.fn().mockImplementation(async (url) => {
    counter += 1;
    const id: string = url.split("/")[2];
    const user: IUser | undefined = usersMock.find((user) => user.id === id);

    return await Promise.resolve({
      data: { user },
    });
  });
};

describe("UserPage", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    counter = 0;
  });

  it("should displays user name on page when user is found", async () => {
    setup();

    render(<UserPage />);

    waitFor(() => {
      const user = screen.findByText("admin");
      expect(user).toBeInTheDocument();
    });
  });

  it("should displays spinner while api call is in progress", async () => {
    setup();

    render(<UserPage />);

    waitFor(() => {
      expect(counter).toBe(1);
    });
  });

  it("should displays error message when user is not found", async () => {
    api.get = jest.fn().mockImplementation(async () => {
      return await Promise.reject({
        response: {
          data: { message: "User not found" },
        },
      });
    });

    render(<UserPage />);

    const error = await screen.findByText("User not found");
    expect(error).toBeInTheDocument();
  });
});
