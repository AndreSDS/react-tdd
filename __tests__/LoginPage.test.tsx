import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "../src/Pages/LoginPage";
import { api } from "../src/service/api";
import en from "../src/locale/en.json";
import pt from "../src/locale/pt-BR.json";
import { LanguageSelector } from "../src/components";

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
    email: "test@email.com",
    password: "123456",
  } as any;

const setupComponent = (lang: any) => {
  render(
    <>
      <LoginPage />
      <LanguageSelector />
    </>
  );

  form = screen.queryByTestId("login-form");
  header = screen.getByRole("heading", { name: lang.login });
  emailLabel = screen.getByLabelText(lang.email);
  passwordLabel = screen.getByLabelText(lang.password);
  loginButton = screen.getByRole("button", { name: lang.login });
  spinner = screen.queryByRole("status");
  failMessage = screen.queryByText("Incorrect email or password");
  togglePortuguese = screen.getByTitle("Portuguese");
  toggleEnglish = screen.getByTitle("English");
};

const setupServer = () => {
  api.post = jest.fn().mockImplementation(async (url: string, body, config) => {
    counter = counter + 1;
    mockBody = await body;
    acceptLanguage = config.headers["Accept-Language"];
    return Promise.resolve();
  });
};

describe("Login Page", () => {
  const setupForm = async () => {
    await userEvent.type(emailLabel, "test@email.com");
    await userEvent.type(passwordLabel, "test");
  };

  beforeEach(() => {
    setupServer();
  });

  afterEach(cleanup);

  describe("Layout", () => {
    beforeEach(() => {
      setupComponent(en);
    });

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
    beforeEach(() => {
      setupComponent(en);
    });

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

      expect(spinner).not.toBeInTheDocument();

      await userEvent.click(loginButton);

      await waitFor(() => {
        const spinner = screen.getByRole("status");

        expect(spinner).toBeInTheDocument();
      });

      expect(spinner).not.toBeInTheDocument();
    });

    it("should sends email and password to api when login button is clicked", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      expect(mockBody).toEqual({ email: "test@email.com", password: "test" });
    });

    it("should disable login button when api call is in progress", async () => {
      await setupForm();

      await userEvent.click(loginButton);

      expect(loginButton).toBeDisabled();
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
      setupComponent(en);

      await userEvent.click(togglePortuguese);

      setupPortugueseAssertions();
    });

    it("should display login in english when english is selected", async () => {
      setupComponent(pt);

      await userEvent.click(toggleEnglish);

      setupEnglishAssertions();
    });

    it("should display login in english by default", () => {
      setupComponent(en);

      setupEnglishAssertions();
    });

    it("sends accept language header as en to backend", async () => {
      setupComponent(en);
      await userEvent.click(loginButton);

      expect(acceptLanguage).toEqual("en");
    });

    it("sends accept language header as pt to backend", async () => {
      setupComponent(en);

      await setupForm();

      await userEvent.click(togglePortuguese);

      await userEvent.click(loginButton);

      expect(acceptLanguage).toEqual("pt");
    });
  });
});

console.error = () => {}
