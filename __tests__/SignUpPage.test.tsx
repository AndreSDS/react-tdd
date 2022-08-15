import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
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

      let mockReqBody: any;

      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          mockReqBody = await body;
          return Promise.resolve({ data: body });
        });

      await userEvent.click(submitButton);

      expect(mockReqBody).toEqual(mockReqBody);
    });

    it("should disable the button when there is an ongoing request", async () => {
      let counter = 0;
      await setup();

      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          counter += 1;
          return Promise.resolve({ data: body });
        });

      await userEvent.click(submitButton);
      await userEvent.click(submitButton);

      expect(counter).toBe(1);
    });

    it("should display spinner when there is an ongoing request", async () => {
      await setup();

      api.post = jest
        .fn()
        .mockImplementation(async (url: string, body: any) => {
          return Promise.resolve({ data: body });
        });

      await userEvent.click(submitButton);

      const spinner = screen.queryByRole("status");

      expect(spinner).toBeInTheDocument();
    });

    it("should NOT display spinner when there is no ongoing request", async () => {
      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    // 
  });
});
