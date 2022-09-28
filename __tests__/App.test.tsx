import React from "react";
import { cleanup, findByRole, render, screen, waitFor } from "../src/test/setup";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { api } from "../src/service/api";
import { usersMock, getPage } from "../src/service/usersMock";
import { getItem, setItem } from "../src/utils/storage";

describe("App", () => {
  const setup = async (path: string) => {
    window.history.pushState({}, "", path);

    render(<App />);
  };

  beforeAll(() => {
    api.post = jest.fn().mockImplementation(async (url) => {
      if (url === "/auth") {
        return Promise.resolve({
          data: {
            id: usersMock[0].id,
            username: usersMock[0].username,
            token: `token-${usersMock[0].id}-${usersMock[0].username}`,
          },
        });
      }

      return Promise.resolve();
    });

    api.get = jest.fn().mockImplementation((url, body) => {
      if (url === "/users/1") {
        return Promise.resolve({
          data: {
            user: usersMock[0],
          },
        });
      }

      let { page, size } = body?.params;

      if (!page) {
        page = 0;
      }

      if (!size) {
        size = 3;
      }

      return Promise.resolve({
        data: {
          data: getPage(Number(page), Number(size), usersMock),
        },
      });
    });
  });

  afterEach(() => cleanup());

  describe("Routing", () => {
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

        waitFor(() => {
          expect(screen.queryByTestId(pageTestId)).toBeInTheDocument();
        });
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

        waitFor(() => {
          expect(screen.queryByTestId(pageTestId)).not.toBeInTheDocument();
        });
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

    it("should navigates to user page when click on user name", async () => {
      await setup("/");

      let userName = await screen.findByText(/admin/i);

      await userEvent.click(userName);

      window.history.pushState({}, "", "/users/1");

      waitFor(() => {
        const page = screen.queryByTestId(/user-page/i);
        expect(page).toBeInTheDocument();
      });
    });
  });

  describe("Login", () => {
    const setupLogin = async () => {
      await setup("/login");

      const emailInput: any = screen.queryByLabelText(/e-mail/i);
      const passwordInput: any = screen.queryByLabelText(/password/i);
      const submitButton: any = screen.queryByRole("button", {
        name: /login/i,
      });

      await userEvent.type(emailInput, `${usersMock[0].email}`);
      await userEvent.type(passwordInput, `${usersMock[0].password}`);
      await userEvent.click(submitButton);
    };

    it("should redirect to home page when login successfully", async () => {
      await setupLogin();

      waitFor(() => {
        const homePage = screen.getByTestId("home-page");
        expect(homePage).toBeInTheDocument();
      });
    });

    it("should hides login and signup links when login successfully", async () => {
      await setupLogin();

      await waitFor(() => {
        const loginLink = screen.queryByRole("link", { name: /login/i });
        const signupLink = screen.queryByRole("link", { name: /signup/i });

        expect(loginLink).not.toBeInTheDocument();
        expect(signupLink).not.toBeInTheDocument();
      });
    });

    it("should display My Profile link when login successfully", async () => {
      const myProfileLinkBeforeLogin = screen.queryByText("My Profile");

      expect(myProfileLinkBeforeLogin).not.toBeInTheDocument();

      await setup("/login");

      await waitFor(() => {
        const myProfileLinkAfterLogin = screen.getByText("My Profile");
        expect(myProfileLinkAfterLogin).toBeInTheDocument();
      });
    });

    it("should displays user page when click on My Profile link", async () => {
      await setupLogin();

      const myProfileLink = screen.getByText("My Profile");

      await userEvent.click(myProfileLink);

      await waitFor(() => {
        const userPage = screen.getByTestId("user-page");
        const userName = screen.getByText("admin");
        expect(userPage).toBeInTheDocument();
        expect(userName).toBeInTheDocument();
      });
    });

    it("should stores logged state in localStorage when api call succeeds", async () => {
      await setupLogin();

      waitFor(() => {
        const homePage = screen.getByTestId("home-page");
        expect(homePage).toBeInTheDocument();
      });

      const loggedUser = JSON.parse(getItem("auth"));

      expect(loggedUser.isLoggedIn).toBeTruthy();
    });

    it("should displays layout of logged in", async () => {
      setItem("auth", { isLoggedIn: true });

      setup("/");

      const myProfileLink = screen.getByText("My Profile");
      expect(myProfileLink).toBeInTheDocument();
    });

    it("should refreshes user page from another user to the logged in user clicking My Profile link", async () => {
      await setupLogin();

      const userNotLoggedIn = await screen.findByText(/user/i);
      await userEvent.click(userNotLoggedIn);

      await screen.findByRole("heading", { name: /user/i });

      const myProfileLink = screen.getByText("My Profile");
      await userEvent.click(myProfileLink);

      const userLoggedIn = await screen.findByRole("heading", { name: /admin/i });
      expect(userLoggedIn).toBeInTheDocument();
    });
  });
});

console.error = () => {};
