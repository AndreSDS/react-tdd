import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

fdescribe("App", () => {
    const homePage = screen.getByTestId("home-page");

  describe("Routing", () => {
    render(<App />);

    it("should render the home page at /", () => {
        expect(homePage).toBeInTheDocument();
    });
  
});

});
