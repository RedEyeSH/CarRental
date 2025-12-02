/*
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

jest.mock("../Auth/Login", () =>
    jest.fn(({ onClose }) => (
        <div>
            Login Modal
            <button data-icon="x-mark" onClick={onClose}></button>
        </div>
    ))
);

jest.mock("../Auth/Register", () => jest.fn(() => <div>Register Modal</div>));
jest.mock("../../assets/vite.svg", () => "mocked-svg");

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation function
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));

describe("Navbar Component", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("renders Navbar with logo", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByAltText("logo")).toBeInTheDocument();
        expect(screen.getByText("Logo name")).toBeInTheDocument();
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

        const signInButton = screen.getByText("Sign In");
        fireEvent.click(signInButton);

        expect(screen.getByText("Login Modal")).toBeInTheDocument();
    });

    test("closes Login modal when close button is clicked", async () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const signInButton = screen.getByText("Sign In");
        fireEvent.click(signInButton);
        expect(screen.getByText("Login Modal")).toBeInTheDocument();

        const closeButton = screen.getByRole("button", { name: "" });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Login Modal")).not.toBeInTheDocument();
        });
    });

    test("shows user dropdown when logged in", () => {
        const user = { name: "John Doe" };
        localStorage.setItem("user", JSON.stringify(user));

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Hi, John Doe/)).toBeInTheDocument();
    });

    test("opens and closes dropdown when username clicked", () => {
        const user = { name: "Jane Doe" };
        localStorage.setItem("user", JSON.stringify(user));

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const username = screen.getByText(/Hi, Jane Doe/);
        fireEvent.click(username);

        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        fireEvent.click(username);
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("logs out user when clicking Logout", () => {
        const user = { name: "Alice" };
        localStorage.setItem("user", JSON.stringify(user));

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Hi, Alice/));
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton);

        expect(localStorage.getItem("user")).toBeNull();
    });
});
 */
