import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ActivationPage } from "../src/Pages/ActivationPage";
import { api } from "../src/service/api";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    token: "123",
  }),
}));

let counter = 0;

describe("Activation Page", () => {
  const setup = (token: string) => {
    api.post = jest.fn().mockImplementation(async (url, request) => {
      counter += 1;

      if (token !== "123") {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    });

    render(<ActivationPage />);
  };

  afterEach(() => {
    counter = 0;
    cleanup();
  });

  it("should displays activation success message when token is valid", async () => {
    setup("123");

    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("should sends activation request to server when token is valid", async () => {
    setup("123");
    expect(counter).toBe(1);
  });

  it("should sends activation request when token changes", async () => {
    setup("123");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();

    setup("456");
    const message2 = await screen.findByText("Activation failed");
    expect(message2).toBeInTheDocument();

    expect(counter).toBe(2);
  });

  it("should displays activation error message when token is invalid", async () => {
    setup("1234");

    const message = await screen.findByText("Activation failed");
    expect(message).toBeInTheDocument();
  });

  it("should displays a spinner while waiting for the response", async () => {
    setup("654");

    const spinner = screen.getByRole("status");

    expect(spinner).toBeInTheDocument();

    const message = await screen.findByText("Activation failed");
    expect(message).toBeInTheDocument();

    expect(spinner).not.toBeInTheDocument();
  });
});

console.error = () => {};
