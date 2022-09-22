import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LanguageSelector } from "../components";

interface IAllTheProviders {
  children: ReactNode;
}

const RootWrapper = ({ children }: IAllTheProviders) => {
  return (
    <BrowserRouter>
      {children}
      <LanguageSelector />
    </BrowserRouter>
  );
};

const CustomRender = (ui: any, options = {} as any) => {
  return render(ui, { wrapper: RootWrapper, ...options });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { CustomRender as render };
