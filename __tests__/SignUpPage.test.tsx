import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SignUp } from "../src/Pages/SignUp";

describe("SignUpPage", () => {
  beforeEach(() => {
    render(<SignUp />);
  });

  it("should has header", () => {
    const header = screen.queryByRole("heading", { name: "Sign Up" });
    expect(header).toBeInTheDocument();
  });
});
