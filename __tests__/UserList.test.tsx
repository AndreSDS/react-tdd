import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { UserList } from "../src/components";
import { api } from "../src/service/api";
import { usersMock, getPage } from "../src/service/usersMock";

describe("UserList", () => {
  const setup = async (page: number, size: number) => {
    if (Number.isNaN(page)) {
      page = 0;
    }

    if (Number.isNaN(size)) {
      size = 5;
    }

    api.get = jest.fn().mockResolvedValue({
      data: getPage(page, size, usersMock),
    });

    await waitFor(() => {
      render(<UserList />);
    });
  };

  afterEach(() => {
    cleanup();
  });

  it("should displays two users in the list", async () => {
    setup(0, 3);

    waitFor(async () => {
      const listUsers = await screen.findAllByText(/user/i);

      expect(listUsers.length).toBe(3);
    });
  });
});
