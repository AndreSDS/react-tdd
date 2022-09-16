import React from "react";
import { cleanup, render, screen, waitFor, act } from "@testing-library/react";
import { usersMock, getPage } from "../src/service/usersMock";
import { createServer, Model, Response, Factory, Request } from "miragejs";

import { UserPage } from "../src/Pages/UserPage";
import { api } from "../src/service/api";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "1",
  }),
}));

const setup = () => {
  api.get = jest.fn().mockImplementation(async (props) => {
    const id = props.split("/")[2];
    const user = usersMock.find((user) => user.id === id);

    return await Promise.resolve({
      data: { user },
    });
  });
};

describe("UserPage", () => {
  beforeEach(() => {
    setup();
  });

  beforeEach(() => {
    cleanup();
  });

  it("should displays user name on page when user is found", async () => {
    render(<UserPage />);

    const user = await screen.findByText("admin");
    expect(user).toBeInTheDocument();
  });

  it("should displays spinner while api call is in progress", async () => {
    render(<UserPage />);

    const spinner = screen.getByRole("status");
    
    expect(spinner).toBeInTheDocument();

    await screen.findByText("admin");

    expect(spinner).not.toBeInTheDocument();
  });
});
