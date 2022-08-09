import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUp } from "../src/Pages/SignUp";
import { api } from "../src/service/api";

jest.mock("../src/service/api");

describe("SignUp Page", () => {
  beforeEach(() => {
    cleanup();
  })

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
    it("should have enabled the button when inputs password and password-repeat have same value", () => {
      const inputPassword = screen.getByLabelText("Password");
      const inputPasswordRepeat = screen.getByLabelText("Password Repeat");
      const submitButton = screen.getByRole("button", { name: "Sign Up" });

      userEvent.type(inputPassword, "123456");
      userEvent.type(inputPasswordRepeat, "123456");

      expect(submitButton).toHaveAttribute("disabled", "");
    });
  });

  it("should sends username, email and password to backend when submit button is clicked", async () => {
    const inputUserName = screen.getByLabelText("Username");
    const inputEmail = screen.getByLabelText("E-mail");
    const inputPassword = screen.getByLabelText("Password");
    const inputPasswordRepeat = screen.getByLabelText("Password Repeat");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    await userEvent.type(inputUserName, "test");
    await userEvent.type(inputEmail, "test@gmail.com");
    await userEvent.type(inputPassword, "123456");
    await userEvent.type(inputPasswordRepeat, "123456");

    const mockFn = jest.fn();
    api.post = mockFn;

    await userEvent.click(submitButton);

    const firstCall = mockFn.mock.calls[0];

    const body = firstCall[1];

    expect(body).toEqual({
      username: "test",
      email: "test@gmail.com",
      password: "123456",
    });
  });
});
