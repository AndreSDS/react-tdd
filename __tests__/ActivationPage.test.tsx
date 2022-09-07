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
      counter = 1;

      if (token !== "123") {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    });

    render(<ActivationPage />);
  };

  afterEach(() => {
    cleanup();
  });

  it("should displays activation success message when token is valid", async () => {
    setup("123");

    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("should sends activation request to server when token is valid", async () => {
    setup("123");

    const message = await screen.findByText("Account is activated");

    expect(counter).toBe(1);
  });

  it("should displays activation error message when token is invalid", async () => {
    setup("1234");

    const message = await screen.findByText("Activation failed");
    expect(message).toBeInTheDocument();
  });
});
