import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // use react-router-dom
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";
import * as AuthContext from "../contexts/AuthContext";

// Mock vite.svg
jest.mock("../assets/vite.svg", () => "mocked-svg");

// Mock useAuth for Navbar in MainLayout
jest.spyOn(AuthContext, "useAuth").mockReturnValue({
  user: null,
  loading: false,
  error: null,
  logout: jest.fn(),
});

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
      <MemoryRouter>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check children rendered
    expect(screen.getByText("Main Content")).toBeInTheDocument();

    // Check Navbar logo (heading)
    expect(screen.getByRole("heading", { name: /Car Rental/i })).toBeInTheDocument();

    // Check Footer brand description
    expect(screen.getByText("Fast, reliable car rentals")).toBeInTheDocument();

    // Optional: check Footer links exist
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
  });
});
