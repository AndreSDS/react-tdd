import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../src/App";

const i18nMocks = {
  home: "home",
  signUp: "signUp",
  login: "login",
};

describe("App", () => {
  describe("Routing", () => {
    const setup = async (path: string) => {
      window.history.pushState({}, "", path);

      render(<App />);
    };

    it.each`
      path         | pageTestId
      ${"/"}       | ${"home-page"}
      ${"/signup"} | ${"signup-page"}
      ${"/login"}  | ${"login-page"}
    `(
      "should render $pageTestId when path is $path",
      async ({ path, pageTestId }) => {
        await setup(path);

        expect(screen.queryByTestId(pageTestId)).toBeInTheDocument();
      }
    );

    it.each`
      path         | pageTestId
      ${"/"}       | ${"signup-page"}
      ${"/"}       | ${"login-page"}
      ${"/signup"} | ${"home-page"}
      ${"/signup"} | ${"login-page"}
      ${"/login"}  | ${"home-page"}
      ${"/login"}  | ${"signup-page"}
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

    fit.each`
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

        expect(screen.queryByTestId(visiblePage)).toBeInTheDocument();
      }
    );
  });
});
