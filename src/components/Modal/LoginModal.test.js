import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginModal from "./LoginModal";

describe("LoginModal", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    render(<LoginModal isOpen={false} onLogin={mockOnLogin} />);
    expect(screen.queryByText("Admin Login")).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    const { container } = render(<LoginModal isOpen={true} onLogin={mockOnLogin} />);

    expect(screen.getByText("Admin Login")).toBeInTheDocument();

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();

    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("displays error message on failed login", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "Invalid credentials" }),
        })
    );

    const { container } = render(<LoginModal isOpen={true} onLogin={mockOnLogin} />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/v1/auth/login", expect.any(Object));
  });

  test("calls onLogin on successful login", async () => {
    const mockUser = { role: "ADMIN" };
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: mockUser, token: "mockToken" }),
        })
    );

    const { container } = render(<LoginModal isOpen={true} onLogin={mockOnLogin} />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
    });
    expect(localStorage.getItem("token")).toBe("mockToken");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
  });

  test("displays 'Access denied' for non-admin users", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: { role: "USER" } }),
        })
    );

    const { container } = render(<LoginModal isOpen={true} onLogin={mockOnLogin} />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Access denied: Admins only")).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test("displays loading state during login", async () => {
    global.fetch = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)));

    const { container } = render(<LoginModal isOpen={true} onLogin={mockOnLogin} />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("button", { name: "Logging in..." })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });
  });
});