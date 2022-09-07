import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { BrowserRouter } from "react-router-dom";
import { api } from "../src/service/api";

const i18nMocks = {
  home: "home",
  signUp: "signUp",
  login: "login",
};

describe("App", () => {
  describe("Routing", () => {
    const setup = async (path: string) => {
      window.history.pushState({}, "", path);

      render(<App />, { wrapper: BrowserRouter });
    };

    beforeAll(() => {
      api.post = jest.fn().mockImplementation(async () => {
        return Promise.resolve();
      });
    });

    afterEach(() => cleanup());

    it.each`
      path               | pageTestId
      ${"/"}             | ${"home-page"}
      ${"/signup"}       | ${"signup-page"}
      ${"/login"}        | ${"login-page"}
      ${"/activate/123"} | ${"activation-page"}
      ${"/activate/456"} | ${"activation-page"}
    `(
      "should render $pageTestId when path is $path",
      async ({ path, pageTestId }) => {
        await setup(path);

        expect(screen.queryByTestId(pageTestId)).toBeInTheDocument();
      }
    );

    it.each`
      path               | pageTestId
      ${"/"}             | ${"signup-page"}
      ${"/"}             | ${"login-page"}
      ${"/"}             | ${"activation-page"}
      ${"/signup"}       | ${"home-page"}
      ${"/signup"}       | ${"login-page"}
      ${"/signup"}       | ${"activation-page"}
      ${"/login"}        | ${"home-page"}
      ${"/login"}        | ${"signup-page"}
      ${"/login"}        | ${"activation-page"}
      ${"/activate/123"} | ${"home-page"}
      ${"/activate/123"} | ${"signup-page"}
      ${"/activate/123"} | ${"login-page"}
    `(
      "should not render $pageTestId when path is $path",
      async ({ path, pageTestId }) => {
        await setup(path);

        expect(screen.queryByTestId(pageTestId)).not.toBeInTheDocument();
      }
    );

    it.each`
      targetPage
      ${"Home"}
      ${"Sign Up"}
      ${"Login"}
    `("should have a link to $targetPage on Navbar", async ({ targetPage }) => {
      await setup("/");

      const link = screen.getByRole("link", { name: targetPage });

      expect(link).toBeInTheDocument();
    });

    it.each`
      initialPath | clickingTo   | visiblePage
      ${"/"}      | ${"Sign Up"} | ${"signup-page"}
      ${"/login"} | ${"Login"}   | ${"login-page"}
      ${"/home"}  | ${"Home"}    | ${"home-page"}
    `(
      "should display $visiblePage when clicking on $initialPath",
      async ({ initialPath, clickingTo, visiblePage }) => {
        await setup(initialPath);

        const link = screen.getByRole("link", { name: clickingTo });

        await userEvent.click(link);

        waitFor(() => {
          const page = screen.queryByTestId(visiblePage);
          expect(page).toBeInTheDocument();
        });
      }
    );

    it("should display home-page when clicking on brand logo", async () => {
      await setup("/login");

      const brandLogo = screen.getByTestId("home-logo");

      await userEvent.click(brandLogo);

      waitFor(() => {
        const homePage = screen.queryByTestId("home-page");
        expect(homePage).toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};
