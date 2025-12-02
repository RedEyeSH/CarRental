import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../assets/vite.svg", () => "mocked-svg");

import Navbar from "./Navbar.jsx";
import * as AuthContext from "../../contexts/AuthContext";

// Mock Login and Register modals
jest.mock("../Auth/Login", () =>
    jest.fn(({ onClose }) => (
        <div>
            Login Modal
            <button data-icon="x-mark" onClick={onClose}></button>
        </div>
    ))
);
jest.mock("../Auth/Register", () => jest.fn(() => <div>Register Modal</div>));

// Mock i18n
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                "navbar.signIn": "Sign In",
                "navbar.register": "Register",
                "navbar.greeting": "Hi, John Doe",
                "navbar.logout": "Logout",
                "navbar.profile": "Profile",
            };
            return translations[key] || key;
        },
        i18n: { changeLanguage: jest.fn() },
    }),
}));

describe("Navbar Component", () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        localStorage.clear();

        // Default: user not logged in
        jest.spyOn(AuthContext, "useAuth").mockReturnValue({
            user: null,
            loading: false,
            error: null,
            logout: mockLogout,
        });
    });

    test("renders Navbar with logo", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText("Car Rental")).toBeInTheDocument();
    });

    test("shows Sign In and Register buttons when no user is logged in", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText("Sign In")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("opens Login modal when 'Sign In' button is clicked", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Sign In"));
        expect(screen.getByText("Login Modal")).toBeInTheDocument();
    });

    test("closes Login modal when close button is clicked", async () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Sign In"));
        const closeButton = screen.getByRole("button", { name: "" });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Login Modal")).not.toBeInTheDocument();
        });
    });

    test("shows user dropdown when logged in", () => {
        // Mock logged-in user
        const user = { name: "John Doe" };
        AuthContext.useAuth.mockReturnValue({
            user,
            loading: false,
            error: null,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Hi, John Doe/)).toBeInTheDocument();
    });

    test("opens and closes dropdown when username clicked", () => {
        const user = { name: "John Doe" };
        AuthContext.useAuth.mockReturnValue({
            user,
            loading: false,
            error: null,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const username = screen.getByText(/Hi, John Doe/);
        fireEvent.click(username);

        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        fireEvent.click(username);
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("logs out user when clicking Logout", () => {
        const user = { name: "John Doe" };
        AuthContext.useAuth.mockReturnValue({
            user,
            loading: false,
            error: null,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Hi, John Doe/));
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
    });
});
