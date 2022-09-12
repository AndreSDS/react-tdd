import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserList } from "../src/components";
import { api } from "../src/service/api";
import { usersMock, getPage } from "../src/service/usersMock";
import { BrowserRouter } from "react-router-dom";

describe("UserList", () => {
  const setup = async () => {
    api.get = jest.fn().mockImplementation((url, body) => {
      let { page, size } = body.params;

      if (Number.isNaN(page)) {
        page = 0;
      }

      if (Number.isNaN(size)) {
        size = 3;
      }

      return Promise.resolve({
        data: {
          data: getPage(Number(page), Number(size), usersMock),
        },
      });
    });
  };

  beforeEach(() => {
    setup();
    render(<UserList />, { wrapper: BrowserRouter });
  });

  afterEach(() => {
    cleanup();
  });

  it("should displays two users in the list", async () => {
    waitFor(() => {
      const listUsers = screen.queryAllByText(/user-/);

      expect(listUsers.length).toBe(3);
    });
  });

  it("should displays next page link", async () => {
    const nextPageLink = await screen.findByText(/next/i);

    expect(nextPageLink).toBeInTheDocument();
  });

  it("should displays next page after click on next page link", async () => {
    const nextPageLink = await screen.findByText(/next/i);

    await userEvent.click(nextPageLink);

    const firstUserOnPage2 = await screen.findByText(/andré/i);

    expect(firstUserOnPage2).toBeInTheDocument();
  });

  it("should hide next page link at last page", async () => {
    const nextPageLink = await screen.findByText(/next/i);

    await userEvent.click(nextPageLink);
    await userEvent.click(nextPageLink);

    const userAtLastPage = await screen.findByText(/daniel/i);
    expect(userAtLastPage).toBeInTheDocument();
    expect(nextPageLink).not.toBeInTheDocument();
  });

  it("should not displays previous page link", async () => {
    const previousPageLink = screen.queryByText(/previous/i);
    expect(previousPageLink).not.toBeInTheDocument();
  });

  it("should displays previous page link after click on next page link", async () => {
    const nextPageLink = await screen.findByText(/next/i);
    await userEvent.click(nextPageLink);

    const previousPageLink = await screen.findByText(/previous/i);
    expect(previousPageLink).toBeInTheDocument();
  });

  it("should displays previous page after click on previous page link", async () => {
    const nextPageLink = await screen.findByText(/next/i);
    await userEvent.click(nextPageLink);

    const previousPageLink = await screen.findByText(/previous/i);
    await userEvent.click(previousPageLink);

    const firstUserOnPage1 = await screen.findByText(/admin/i);
    expect(firstUserOnPage1).toBeInTheDocument();
  });
});
