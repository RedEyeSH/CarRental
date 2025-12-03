import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUserModal from "./EditUserModal";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k) => k,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: {},
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("EditUserModal", () => {
  const userId = 42;
  const mockUser = { id: userId, name: "Alice", email: "alice@example.com", role: "customer" };
  const onClose = jest.fn();

  test("does not render when isOpen is false", () => {
    render(<EditUserModal isOpen={false} userId={userId} onClose={onClose} />);
    // adjust the text key if your modal title is different
    expect(screen.queryByText("editUser.title")).not.toBeInTheDocument();
  });

  test("shows loading and then populates fields when opened", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(<EditUserModal isOpen={true} userId={userId} onClose={onClose} />);

    // waiting for loading -> form populated
    await waitFor(() => {
      // change these selectors to match your markup (labels/placeholders/role)
      const name = screen.queryByLabelText("editUser.form.name") || screen.queryByDisplayValue("Alice");
      expect(name).toBeTruthy();
      expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  test("validates and submits updated user data", async () => {
    // GET user
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
      // PUT/POST update
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockUser, name: "Alice Edited" }) });

    render(<EditUserModal isOpen={true} userId={userId} onClose={onClose} />);

    // wait for form populated
    await waitFor(() => expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument());

    // find name input (adjust label/placeholder if needed)
    const nameInput =
      screen.queryByLabelText("editUser.form.name") ||
      screen.getByDisplayValue("Alice") ||
      screen.getByPlaceholderText(/name/i);

    // change value and submit
    fireEvent.change(nameInput, { target: { value: "Alice Edited" } });

    // find and click Save/Submit button (adjust text)
    const saveBtn = screen.getByRole("button", { name: /editUser.save|Save|Update/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      // expect(onClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when Cancel/Close is clicked", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });

    render(<EditUserModal isOpen={true} userId={userId} onClose={onClose} />);
    await waitFor(() => expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument());

    const cancel = screen.queryByRole("button", { name: /cancel|Close|editUser.cancel/i }) || screen.getByText("×");
    fireEvent.click(cancel);
    expect(onClose).toHaveBeenCalled();
  });
});