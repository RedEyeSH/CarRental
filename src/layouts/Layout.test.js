import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router"; // Import MemoryRouter
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";

jest.mock('../assets/vite.svg', () => 'mocked-svg'); // Mock vite.svg

describe("AdminLayout", () => {
    test("renders children correctly", () => {
        render(
            <AdminLayout>
                <div>Admin Content</div>
            </AdminLayout>
        );
        expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });
});

describe("MainLayout", () => {
    test("renders Navbar, Footer, and children correctly", () => {
        render(
            <MemoryRouter> {/* Wrap in MemoryRouter */}
                <MainLayout>
                    <div>Main Content</div>
                </MainLayout>
            </MemoryRouter>
        );
        expect(screen.getByText("Main Content")).toBeInTheDocument();
        expect(screen.getByAltText("logo")).toBeInTheDocument();
        expect(screen.getByText("footer")).toBeInTheDocument();
    });
});