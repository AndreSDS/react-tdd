import React from "react";
import { render, screen, waitFor } from "../src/test/setup";
import { Navbar } from "../src/components/Navbar";

describe("Navbar", () => {
  render(
      <Navbar />
  );

  it("should render", () => {
    const homeLogo = screen.getByTestId("home-logo");

    // assertion
    // expect(homeLogo).toBeTruthy();
    // expect(homeLogo).toBeInTheDocument();
    expect(homeLogo).toHaveAttribute("src");
  });

  it("should render signup link", async () => {
      
      waitFor(() => {
        const signupLink = screen.queryByTestId("signup-link");
        
        expect(signupLink).toBeInTheDocument();
    })

    // expect(signupLink).toHaveTextContent("Sign Up");

  })
});
