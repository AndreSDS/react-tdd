import React from "react";
import { cleanup, render, screen, waitFor } from "../src/test/setup";
import userEvent from "@testing-library/user-event";
import { getItem, setItem } from "../src/utils/storage";
import { ProfileCard } from "../src/components";
import { IUser } from "../src/interfaces/user";
import { api } from "../src/service/api";

const user1: IUser = {
  id: "1",
  username: "test",
  password: "test",
  email: "email@email.com",
};

const user2: IUser = {
  id: "2",
  username: "user-2",
  password: "user-2",
  email: "email2@email.com",
};

let counter: number, id: string, body: any, header: string;

const setupComponent = (user: IUser = user1) => {
  setItem("auth", { ...user, header: "auth header value" });

  render(<ProfileCard user={user} />);

  const header: any = screen.queryByText("test");
  const editButton: any = screen.queryByRole("button", { name: "Edit" });

  return { editButton, header };
};

const setupEditingMode = () => {
  const inputUserName: any = screen.queryByPlaceholderText(
    "Change your username"
  );
  const saveButton: any = screen.queryByRole("button", { name: "Save" });
  const cancelButton: any = screen.queryByRole("button", { name: "Cancel" });

  return { inputUserName, saveButton, cancelButton };
};

const setupServer = () => {
  api.put = jest.fn().mockImplementation(async (url, request, config) => {
    counter += 1;
    id = await url.split("/")[2];
    body = await request;
    header = await config.headers["Authorization"];
    return Promise.resolve();
  });
};

describe("ProfileCard", () => {
  beforeAll(() => {
    setupServer();
  });

  afterEach(() => {
    counter = 0;
    id = "";
    cleanup();
  });

  it("should displays edit button when user is logged in", () => {
    const { editButton } = setupComponent();

    expect(editButton).toBeInTheDocument();
  });

  it("should not displays edit button for another user", async () => {
    const { editButton } = setupComponent(user2);

    waitFor(() => {
      expect(editButton).not.toBeInTheDocument();
    });
  });

  it("should displays an input username after clicking edit button", async () => {
    const { editButton } = setupComponent();

    const inputUserNameBefore = screen.queryByPlaceholderText(
      "Change your username"
    );

    expect(inputUserNameBefore).not.toBeInTheDocument();

    await userEvent.click(editButton);

    const { inputUserName } = setupEditingMode();

    expect(inputUserName).toBeInTheDocument();
  });

  it("should input username has the same value as the user's username", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName } = setupEditingMode();

    expect(inputUserName).toHaveValue("test");
  });

  it("should displays save and cancel button when is editing", async () => {
    const { editButton } = setupComponent();

    const saveButtonBefore: any = screen.queryByRole("button", {
      name: "Save",
    });
    const cancelButtonBefore: any = screen.queryByRole("button", {
      name: "Cancel",
    });

    expect(saveButtonBefore).not.toBeInTheDocument();
    expect(cancelButtonBefore).not.toBeInTheDocument();

    await userEvent.click(editButton);

    const { cancelButton, saveButton } = setupEditingMode();

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("it should hides edit button and header when is editing", async () => {
    const { editButton, header } = setupComponent();

    await userEvent.click(editButton);

    expect(editButton).not.toBeInTheDocument();
    expect(header).not.toBeInTheDocument();
  });

  it("should hides input, cancelbutton and savebutton after clicking cancel button", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, cancelButton, saveButton } = setupEditingMode();

    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    expect(inputUserName).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(saveButton).not.toBeInTheDocument();
  });

  it("should displays spinner when is saving", async () => {
    let { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, cancelButton, saveButton } = setupEditingMode();

    await userEvent.type(inputUserName, "new username");

    await userEvent.click(saveButton);

    waitFor(() => {
      expect(counter).toBe(1);
    });
  });

  it("should disabled the save button during the request", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { saveButton, inputUserName } = setupEditingMode();
    
    await userEvent.type(inputUserName, "new username");
  
    await userEvent.click(saveButton);

    waitFor(() => {
      expect(counter).toBe(1);
      expect(saveButton).toBeDisabled();
    });
  });

  it("should requests to the end point having logged user id", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, saveButton } = setupEditingMode();

    await userEvent.clear(inputUserName);

    await userEvent.type(inputUserName, "new username");

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(id).toBe("1");
    });
  });

  it("should requests with body having the new username", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, saveButton } = setupEditingMode();

    await userEvent.clear(inputUserName);

    await userEvent.type(inputUserName, "new username");

    await userEvent.click(saveButton);

    expect(body).toEqual({ username: "new username" });
  });

  it("should request with authorization header", async () => {
    const { editButton } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, saveButton } = setupEditingMode();

    await userEvent.clear(inputUserName);

    await userEvent.type(inputUserName, "new name");

    await userEvent.click(saveButton);

    waitFor(() => {
      expect(header).toEqual(JSON.parse(getItem("auth")).header);
    });
  });

  it("should updates user name in profile card after clicking save button", async () => {
    const { editButton, header } = setupComponent();

    await userEvent.click(editButton);

    const { inputUserName, saveButton } = setupEditingMode();

    await userEvent.clear(inputUserName);

    await userEvent.type(inputUserName, "new name");

    await userEvent.click(saveButton);

    waitFor(() => {
      expect(header).toHaveTextContent("new name");
    });
  });
});

console.error = () => {};
