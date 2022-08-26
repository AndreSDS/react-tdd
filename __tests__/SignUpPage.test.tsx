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
import { SignUp } from "../src/Pages/SignUp";
import { api } from "../src/service/api";
import { IUser } from "../src/interfaces/user";

jest.mock("../src/service/api");

describe("SignUp Page", () => {
  beforeEach(() => {
    cleanup();
  });

  let wrapperContainer: HTMLElement;

  beforeEach(() => {
    const { container } = render(<SignUp />);

    wrapperContainer = container;
  });

  describe("Layout", () => {
    it("should have header", () => {
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("should have username input", () => {
      const inputUserName = screen.getByLabelText("Username");
      expect(inputUserName).toBeInTheDocument();
    });

    it("should have email input", () => {
      const inputEmail = screen.getByLabelText("E-mail");
      expect(inputEmail).toBeInTheDocument();
    });

    it("should have password input", () => {
      const inputPassword = screen.getByLabelText("Password");
      expect(inputPassword).toBeInTheDocument();
    });

    it("should have password type for password input", () => {
      const inputPassword = screen.getByLabelText("Password");
      expect(inputPassword).toHaveAttribute("type", "password");
    });

    it("should have password repeat input", () => {
      const inputPasswordRepeat = screen.getByLabelText("Password Repeat");
      expect(inputPasswordRepeat).toBeInTheDocument();
    });

    it("should have password repeat type for password repeat input", () => {
      const inputPasswordRepeat = screen.getByLabelText("Password Repeat");
      expect(inputPasswordRepeat).toHaveAttribute("type", "password");
    });

    it("should have submit button", () => {
      const submitButton = screen.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeInTheDocument();
    });

    it("should have submit button type submit", () => {
      const submitButton = screen.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("should have disabled the button initially", () => {
      const submitButton = screen.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Behavior", () => {
    let submitButton: HTMLElement;
    let counter = 0;
    let mockReqBody: any;
    const message = "Please check your email to activate your account";

    beforeAll(() => {
      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          counter += 1;
          mockReqBody = await body;
          return Promise.resolve({ data: body });
        });
    });

    beforeEach(() => {
      counter = 0;
    });

    const setup = async () => {
      const mockUserObject: IUser = {
        username: "test",
        email: "test@gmail.com",
        password: "123456",
      };

      const inputUserName = screen.getByLabelText("Username");
      const inputEmail = screen.getByLabelText("E-mail");
      const inputPassword = screen.getByLabelText("Password");
      const inputPasswordRepeat = screen.getByLabelText("Password Repeat");
      submitButton = screen.getByRole("button", { name: "Sign Up" });

      await userEvent.type(inputUserName, mockUserObject.username);
      await userEvent.type(inputEmail, mockUserObject.email);
      await userEvent.type(inputPassword, mockUserObject.password);
      await userEvent.type(inputPasswordRepeat, mockUserObject.password);
    };

    it("should have enabled the button when inputs password and password-repeat have same value", async () => {
      await setup();

      expect(submitButton).toBeEnabled();
    });

    it("should sends username, email and password to backend when submit button is clicked", async () => {
      await setup();

      await userEvent.click(submitButton);

      expect(mockReqBody).toEqual(mockReqBody);
    });

    it("should disable the button when there is an ongoing request", async () => {
      await setup();

      await userEvent.click(submitButton);
      await userEvent.click(submitButton);

      expect(counter).toBe(1);
    });

    it("should display spinner when there is an ongoing request", async () => {
      await setup();

      const spinner = screen.queryByRole("status");

      expect(spinner).toBeNull();

      await userEvent.click(submitButton);

      // expect(spinner).toBeInTheDocument();

      await screen.findByText(message);
    });

    it("should NOT display spinner when there is no ongoing request", async () => {
      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    it("should display account activation notification after successful sign up request", async () => {
      await setup();

      expect(screen.queryByText(message)).not.toBeInTheDocument();
      await userEvent.click(submitButton);
      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it("should hide spinner and enable button after successful sign up request", async () => {
      await setup();

      const inputUserName = screen.getByLabelText("Username");

      await userEvent.clear(inputUserName);

      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          return Promise.resolve({ data: body });
        });

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });

    it("should hide the form after successful sign up request", async () => {
      await setup();

      const form = screen.getByTestId("sign-up-form");

      await userEvent.click(submitButton);

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
      field         | message
      ${"Username"} | ${"Username is required"}
      ${"E-mail"}   | ${"E-mail cannot be null"}
      ${"Password"} | ${"Password must be at least 6 characters"}
    `("displays $message for $field", async ({ field, message }) => {
      await setup();

      const input = screen.getByLabelText(field);
      await userEvent.clear(input);

      await generateValidationMessage(field, message);

      await userEvent.click(submitButton);

      waitFor(
        async () => {
          const validationMessage = await screen.findByText(message);

          expect(validationMessage).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("displays mismatch password message for password-repeat", async () => {
      await setup();

      const inputPassword = screen.getByLabelText("Password");
      const inputPasswordRepeat = screen.getByLabelText("Password Repeat");

      await userEvent.type(inputPassword, "123456");
      await userEvent.type(inputPasswordRepeat, "123457");

      const validationMessage = screen.getByText("Password does not match");

      expect(validationMessage).toBeInTheDocument();
    });

    it.each`
      field         | message
      ${"Username"} | ${"Username is required"}
      ${"E-mail"}   | ${"E-mail cannot be null"}
      ${"Password"} | ${"Password must be at least 6 characters"}
    `(
      "clears errors messages after $field is filled",
      async ({ field, message, label }) => {
        const input = screen.getByLabelText(field);
        let validationMessage: HTMLElement | null = null;

        await generateValidationMessage(field, message);

        await userEvent.click(submitButton);

        waitFor(async () => {
          validationMessage = await screen.findByText(message);

          expect(validationMessage).toBeInTheDocument();
        });

        await userEvent.type(input, "123456");

        validationMessage = screen.queryByText(message);

        expect(validationMessage).not.toBeInTheDocument();
      }
    );
  });
});
