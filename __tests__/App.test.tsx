import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

fdescribe("App", () => {
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
  });
});
