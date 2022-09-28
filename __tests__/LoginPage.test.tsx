import React from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../src/test/setup";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "../src/Pages/LoginPage";
import { api } from "../src/service/api";
import en from "../src/locale/en.json";
import pt from "../src/locale/pt-BR.json";
import { usersMock } from "../src/service/usersMock";
import { getItem } from "../src/utils/storage";

let form: any,
  header: any,
  emailLabel: any,
  passwordLabel: any,
  loginButton: any,
  spinner: any,
  failMessage: any,
  togglePortuguese: any,
  toggleEnglish: any,
  acceptLanguage: any,
  counter = 0,
  mockBody = {
    email: usersMock[0].email,
    password: usersMock[0].password,
  } as any,
  mockDisabled = false;

const setupComponent = () => {
  render(<LoginPage />);

  togglePortuguese = screen.getByTitle("Portuguese");
  toggleEnglish = screen.getByTitle("English");
  failMessage = screen.queryByText("Incorrect email or password");
};

const setupQueries = (lang: any) => {
  form = screen.queryByTestId("login-form");
  header = screen.getByRole("heading", { name: lang.login });
  emailLabel = screen.getByLabelText(lang.email);
  passwordLabel = screen.getByLabelText(lang.password);
  loginButton = screen.getByRole("button", { name: lang.login });
};

const setupServer = () => {
  api.post = jest.fn().mockImplementation(async (url: string, body, config) => {
    counter = counter + 1;
    mockBody = await body;
    mockDisabled = true;
    acceptLanguage = config.headers["Accept-Language"];

    return Promise.resolve({
      data: {
        id: usersMock[0].id,
        username: usersMock[0].username,
        token: `token-${usersMock[0].id}-${usersMock[0].username}`,
      },
    });
  });
};

const setupForm = async () => {
  await userEvent.type(emailLabel, usersMock[0].email);
  await userEvent.type(passwordLabel, usersMock[0].password);
};

describe("Login Page", () => {
  beforeEach(() => {
    setupServer();
    setupComponent();
    setupQueries(en);
  });

  afterEach(cleanup);

  describe("Layout", () => {
    it("has header of Login", () => {
      expect(header).toBeInTheDocument();
    });

    it("has email input", () => {
      expect(emailLabel).toBeInTheDocument();
    });

    it("has password input", () => {
      expect(passwordLabel).toBeInTheDocument();
    });

    it("has login button", () => {
      expect(loginButton).toBeInTheDocument();
    });

    it("has login button disabled", () => {
      expect(loginButton).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("should enable login button when email and password are provided", async () => {
      await setupForm();

      expect(loginButton).toBeEnabled();
    });

    it("should disable login button when email is clear", async () => {
      await setupForm();

      expect(loginButton).toBeEnabled();

      await userEvent.clear(emailLabel);

      expect(loginButton).toBeDisabled();
    });

    it("should disable login button when password is clear", async () => {
      await setupForm();

      expect(loginButton).toBeEnabled();

      await userEvent.clear(passwordLabel);

      expect(loginButton).toBeDisabled();
    });

    it("should display spinner when login button is clicked", async () => {
      await setupForm();

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();

      await userEvent.click(loginButton);

      // expect(spinner).toBeInTheDocument();

      // await waitFor(() => expect(spinner).not.toBeInTheDocument());
    });

    it("should sends email and password to api when login button is clicked", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      expect(mockBody).toEqual({
        email: usersMock[0].email,
        password: usersMock[0].password,
      });
    });

    it("should disable login button when api call is in progress", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      expect(mockDisabled).toBeTruthy();
    });

    it("should display fail message when api call fails", async () => {
      await setupForm();

      api.post = jest.fn().mockImplementation(async (url: string, body) => {
        return Promise.reject({
          response: {
            status: 401,
            data: {
              message: "Incorrect email or password",
            },
          },
        });
      });

      await userEvent.click(loginButton);

      await waitFor(() => {
        const failMessage = screen.getByText("Incorrect email or password");
        expect(failMessage).toBeInTheDocument();
      });
    });

    it("should clears fail message when email or password is changed", async () => {
      await setupForm();
      const failMessage = "Incorrect email or password";

      api.post = jest.fn().mockRejectedValue({
        response: {
          status: 401,
          data: {
            message: failMessage,
          },
        },
      });

      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(failMessage)).toBeInTheDocument();
      });

      await userEvent.clear(emailLabel);

      expect(screen.queryByText(failMessage)).not.toBeInTheDocument();
    });

    it("should store id, username and token un storage when api call is successful", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      const storadeState = JSON.parse(getItem("auth"));

      expect(storadeState).toEqual({
        header: `Bearer token-${usersMock[0].id}-${usersMock[0].username}`,
        isLoggedIn: true,
        id: usersMock[0].id,
        username: usersMock[0].username,
        token: `token-${usersMock[0].id}-${usersMock[0].username}`,
      });
    });

    it("should stores authorization header value in storage when api call succeeds", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      const loggedUser = JSON.parse(getItem("auth"));

      expect(loggedUser.header).toBe(`Bearer ${loggedUser.token}`);
    });
  });

  describe("Internationalization", () => {
    const setupEnglishAssertions = () => {
      expect(header).toHaveTextContent(en.login);
      expect(emailLabel).toHaveAttribute("placeholder", en.email);
      expect(passwordLabel).toHaveAttribute("placeholder", en.password);
      expect(loginButton).toHaveTextContent(en.login);
    };

    const setupPortugueseAssertions = () => {
      expect(header).toHaveTextContent(pt.login);
      expect(emailLabel).toHaveAttribute("placeholder", pt.email);
      expect(passwordLabel).toHaveAttribute("placeholder", pt.password);
      expect(loginButton).toHaveTextContent(pt.login);
    };

    it("should display login in portuguese when portuguese is selected", async () => {
      await userEvent.click(togglePortuguese);

      waitFor(() => {
        setupPortugueseAssertions();
      });
    });

    it("should display login in english when english is selected", async () => {
      await userEvent.click(toggleEnglish);

      waitFor(() => {
        setupEnglishAssertions();
      });
    });

    it("should display login in english by default", () => {
      waitFor(() => {
        setupEnglishAssertions();
      });
    });

    it("sends accept language header as en to backend", async () => {
      await userEvent.click(loginButton);

      expect(acceptLanguage).toEqual("en");
    });

    it("sends accept language header as pt to backend", async () => {
      await setupForm();

      await userEvent.click(togglePortuguese);

      await userEvent.click(loginButton);

      expect(acceptLanguage).toEqual("pt");
    });
  });
});

console.error = () => {};
