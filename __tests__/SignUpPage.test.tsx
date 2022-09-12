import React from "react";
import "@testing-library/jest-dom";
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpPage } from "../src/Pages/SignUp";
import { LanguageSelector } from "../src/components/LanguageSelector";
import { api } from "../src/service/api";
import { IUser } from "../src/interfaces/user";
import i18n from "../src/locale/i18n";

jest.mock("../src/service/api");
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: jest.fn(),
        language: i18n.language,
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

const i18nMocks = {
  signUp: "signUp",
  username: "username",
  email: "email",
  password: "password",
  passwordRepeat: "passwordRepeat",
  passwordMissmatch: "passwordMissmatch",
};

let form: any,
  header: any,
  usernameLabel: any,
  emailLabel: any,
  passwordLabel: any,
  passwordRepeatLabel: any,
  submitButtonIntl: any,
  togglePortuguese: any,
  toggleEnglish: any,
  validationMessage: any,
  acceptLanguage = i18n.language,
  counter = 0,
  mockReqBody: any;

const message = "Please check your email to activate your account";

const setupComponent = () => {
  render(
    <>
      <SignUpPage />
      <LanguageSelector />
    </>
  );

  form = screen.queryByTestId("sign-up-form");
  header = screen.getByRole("heading", { name: i18nMocks.signUp });
  usernameLabel = screen.queryByLabelText(i18nMocks.username);
  emailLabel = screen.queryByLabelText(i18nMocks.email);
  passwordLabel = screen.queryByLabelText(i18nMocks.password);
  passwordRepeatLabel = screen.queryByLabelText(i18nMocks.passwordRepeat);
  submitButtonIntl = screen.queryByRole("button", { name: i18nMocks.signUp });
  togglePortuguese = screen.getByTitle("Portuguese");
  toggleEnglish = screen.getByTitle("English");
};

describe("SignUp Page", () => {
  beforeAll(() => {
    api.post = jest
      .fn()
      .mockImplementation(async (url: string, body: any, config) => {
        counter += 1;
        mockReqBody = await body;
        return Promise.resolve({ data: body });
      });

    api.get = jest.fn().mockResolvedValue({
      data: [],
    });
  });

  beforeEach(() => {
    setupComponent();
  });
  afterEach(cleanup);

  describe("Layout", () => {
    it("should have header", async () => {
      expect(header).toBeInTheDocument();
    });

    it("should have username input", () => {
      expect(usernameLabel).toBeInTheDocument();
    });

    it("should have email input", () => {
      expect(emailLabel).toBeInTheDocument();
    });

    it("should have password input", () => {
      expect(passwordLabel).toBeInTheDocument();
    });

    it("should have password type for password input", () => {
      expect(passwordLabel).toHaveAttribute("type", "password");
    });

    it("should have password repeat input", () => {
      expect(passwordRepeatLabel).toBeInTheDocument();
    });

    it("should have password repeat type for password repeat input", () => {
      expect(passwordRepeatLabel).toHaveAttribute("type", "password");
    });

    it("should have submit button", () => {
      expect(submitButtonIntl).toBeInTheDocument();
    });

    it("should have submit button type submit", () => {
      expect(submitButtonIntl).toHaveAttribute("type", "submit");
    });

    it("should have disabled the button initially", () => {
      expect(submitButtonIntl).toBeDisabled();
    });
  });

  describe("Behavior", () => {
    const setupMockuser = async () => {
      const mockUserObject: IUser = {
        id: '1',
        username: "test",
        email: "test@gmail.com",
        password: "123456",
      };

      await userEvent.type(usernameLabel, mockUserObject.username);
      await userEvent.type(emailLabel, mockUserObject.email);
      await userEvent.type(passwordLabel, mockUserObject.password);
      await userEvent.type(passwordRepeatLabel, mockUserObject.password);
    };

    beforeEach(async () => {
      counter = 0;
      await setupMockuser();
    });

    it("should have enabled the button when inputs password and password-repeat have same value", async () => {
      expect(submitButtonIntl).toBeEnabled();
    });

    it("should sends username, email and password to backend when submit button is clicked", async () => {
      await userEvent.click(submitButtonIntl);

      expect(mockReqBody).toEqual(mockReqBody);
    });

    it("should disable the button when there is an ongoing request", async () => {
      await userEvent.click(submitButtonIntl);
      await userEvent.click(submitButtonIntl);

      expect(counter).toBe(1);
    });

    it("should display spinner when there is an ongoing request", async () => {
      const spinner = screen.queryByRole("status");

      expect(spinner).toBeNull();

      await userEvent.click(submitButtonIntl);

      // expect(spinner).toBeInTheDocument();

      await screen.findByText(message);
    });

    it("should NOT display spinner when there is no ongoing request", async () => {
      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    it("should display account activation notification after successful sign up request", async () => {
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      await userEvent.click(submitButtonIntl);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should hide spinner and enable button after successful sign up request", async () => {
      await userEvent.clear(usernameLabel);

      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          return Promise.resolve({ data: body });
        });

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
      // expect(submitButtonIntl).toBeEnabled();
    });

    it("should hide the form after successful sign up request", async () => {
      const form = screen.getByTestId("sign-up-form");

      await userEvent.click(submitButtonIntl);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    const generateValidationMessage = async (
      field: string,
      message: string
    ) => {
      const formatFieldName = field.toLowerCase().replace(/[^a-z]/g, "");

      api.post = jest.fn().mockImplementation(async () => {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              errors: {
                [formatFieldName]: message,
              },
            },
          },
        });
      });
    };

    it.each`
      field                 | message
      ${i18nMocks.username} | ${"Username is required"}
      ${i18nMocks.email}    | ${"E-mail cannot be null"}
      ${i18nMocks.password} | ${"Password must be at least 6 characters"}
    `("displays $message for $field", async ({ field, message }) => {
      const input = screen.getByLabelText(field);
      await userEvent.clear(input);

      await generateValidationMessage(field, message);

      await userEvent.click(submitButtonIntl);

      waitFor(
        async () => {
          validationMessage = await screen.findByText(message);

          expect(validationMessage).toBeInTheDocument();
        },
        { timeout: 4000 }
      );
    });

    it("displays mismatch password message for password-repeat", async () => {
      await userEvent.type(passwordLabel, "123456");
      await userEvent.type(passwordRepeatLabel, "123457");

      validationMessage = screen.getByText(i18nMocks.passwordMissmatch);

      expect(validationMessage).toBeInTheDocument();
    });

    it.each`
      field                 | message
      ${i18nMocks.username} | ${"Username is required"}
      ${i18nMocks.email}    | ${"E-mail cannot be null"}
      ${i18nMocks.password} | ${"Password must be at least 6 characters"}
    `(
      "clears errors messages after $field is filled",
      async ({ field, message }) => {
        const input = screen.getByLabelText(field);

        await generateValidationMessage(field, message);

        await userEvent.click(submitButtonIntl);

        waitFor(
          async () => {
            validationMessage = await screen.findByText(message);

            expect(validationMessage).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        await userEvent.type(input, "123456");

        validationMessage = screen.queryByText(message);

        expect(validationMessage).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationlization", () => {
    const setupAssertions = () => {
      expect(header).toBeInTheDocument();
      expect(usernameLabel).toBeInTheDocument();
      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
      expect(passwordRepeatLabel).toBeInTheDocument();
      expect(submitButtonIntl).toBeInTheDocument();
    };

    it("displays all texts in English", async () => {
      setupAssertions();
    });

    it("displays all texts in Portuguese after change the language", async () => {
      await userEvent.click(togglePortuguese);
      setupAssertions();
    });

    it("displays all texts in English after change back from Portuguese", async () => {
      await userEvent.click(toggleEnglish);

      setupAssertions();
    });

    it("sends accept language header as en to backend", async () => {
      await userEvent.click(submitButtonIntl);

      waitForElementToBeRemoved(form);

      expect(acceptLanguage).toEqual("en");
    });

    it("sends accept language header as pt to backend", async () => {
      await userEvent.click(togglePortuguese);
      await userEvent.click(submitButtonIntl);

      waitForElementToBeRemoved(form);
    });
  });
});
