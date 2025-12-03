import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // use react-router-dom
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";

jest.mock('../assets/vite.svg', () => 'mocked-svg');

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

jest.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        user: { name: "Test User", role: "admin" }, // Provide a user so it doesn't crash
        loading: false,
        error: null,
        logout: jest.fn()
    }),
}));

describe("AdminLayout", () => {
    test("renders children correctly", () => {
        render(
            <MemoryRouter>
                <AdminLayout>
                    <div>Admin Content</div>
                </AdminLayout>
            </MemoryRouter>
        );
        expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });
});

describe("MainLayout", () => {
    test("renders Navbar, Footer, and children correctly", () => {
        render(
            <MemoryRouter>
                <MainLayout>
                    <div>Main Content</div>
                </MainLayout>
            </MemoryRouter>
        );
        expect(screen.getByText("Main Content")).toBeInTheDocument();

        // Use getAllByText to handle multiple matches
        const logoElements = screen.getAllByText("Car Rental");
        expect(logoElements[0]).toBeInTheDocument(); // Assert on the first occurrence (Navbar logo)
    });
});
