import React from "react";
import { getByLabelText, render } from "../src/test/setup";
import { Input } from "../src/components/Input";

describe("Input", () => {
  it("has error class for input when errorMessage is set", () => {
    const { container } = render(
      <Input
        type="text"
        label="input"
        id="input"
        onChange={() => {}}
        errorMessage="error"
      />
    );

    const input = container.querySelector("input");

    expect(input?.classList).toContain("error-input");
  });

  it("has no error class for input when errorMessage is not set", () => {
    const { container } = render(
      <Input
        type="text"
        label="input"
        id="input"
        onChange={() => {}}
        errorMessage=""
      />
    );

    const input = container.querySelector("input");

    expect(input?.classList).not.toContain("error-input");
  });

  it("has span with class error when errorMessage is set", () => {
    const { container } = render(
      <Input
        type="text"
        label="input"
        id="input"
        onChange={() => {}}
        errorMessage="error"
      />
    );

    const span = container.querySelector("span");

    expect(span?.classList).toContain("error");
  });
});
