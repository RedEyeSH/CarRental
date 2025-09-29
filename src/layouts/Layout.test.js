import React from "react";
import { render, screen } from "@testing-library/react";
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";

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
            <MainLayout>
                <div>Main Content</div>
            </MainLayout>
        );
        expect(screen.getByText("Main Content")).toBeInTheDocument();
        expect(screen.getByAltText("logo")).toBeInTheDocument(); // For Navbar logo
        expect(screen.getByText("footer")).toBeInTheDocument(); // For Footer heading
    });
});