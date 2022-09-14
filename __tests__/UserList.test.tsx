import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserList, LanguageSelector } from "../src/components";
import { api } from "../src/service/api";
import { usersMock, getPage } from "../src/service/usersMock";
import { BrowserRouter } from "react-router-dom";
import en from "../src/locale/en.json";
import pt from "../src/locale/pt-BR.json";

describe("UserList", () => {
  describe("interactions", () => {
    const setup = () => {
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

    it("should displays spinner while loading data", async () => {
      const spinner = screen.getByRole("status");
      
      expect(spinner).toBeInTheDocument();

      await screen.findByText(/admin/i);

      expect(spinner).not.toBeInTheDocument();
    });
    
  });

  describe("internationlization", () => {
    const setup = () => {
      api.get = jest.fn().mockResolvedValue({
        data: {
          data: getPage(1, 3, usersMock),
        },
      });
    };

    beforeEach(async () => {
      setup();

      render(
        <BrowserRouter>
          <UserList />
          <LanguageSelector />
        </BrowserRouter>
      );
    });

    afterEach(() => {
      cleanup();
    });

    it("should displays header and pagination buttons text in english", async () => {
      const header = screen.getByText(en.users);
      const previousPageLink = await screen.findByText(en.previousPage);
      const nextPageLink = await screen.findByText(en.nextPage);

      expect(header).toBeInTheDocument();
      expect(previousPageLink).toBeInTheDocument();
      expect(nextPageLink).toBeInTheDocument();
    });

    it("should cheanges header and pagination buttons after click in a language option", async () => {
      const togglePortuguese = screen.getByTitle("Portuguese");
      const toggleEnglish = screen.getByTitle("English");

      const header = await screen.findByText(en.users);
      const previousPageLink = await screen.findByText(en.previousPage);
      const nextPageLink = await screen.findByText(en.nextPage);

      await userEvent.click(togglePortuguese);

      expect(header).toHaveTextContent(pt.users);
      expect(previousPageLink).toHaveTextContent(pt.previousPage);
      expect(nextPageLink).toHaveTextContent(pt.nextPage);

      await userEvent.click(toggleEnglish);

      expect(header).toHaveTextContent(en.users);
      expect(previousPageLink).toHaveTextContent(en.previousPage);
      expect(nextPageLink).toHaveTextContent(en.nextPage);

    });
  });
});
