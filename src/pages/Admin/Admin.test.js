import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // For Link components
import Admin from "./Admin";
import Dashboard from "./Dashboard/Dashboard";
import Stock from "./Stock/Stock";
import Rental from "./ActiveRentals/ActiveRentals";
import Booking from "../Booking/Booking";

// Mock child components to simplify tests
jest.mock("./Dashboard/Dashboard", () => () => <div data-testid="dashboard">Dashboard Component</div>);
jest.mock("./Stock/Stock", () => () => <div data-testid="stock">Stock Component</div>);
jest.mock("./ActiveRentals/ActiveRentals", () => () => <div data-testid="rental">Rental Component</div>);
jest.mock("../Booking/Booking", () => () => <div data-testid="booking">Booking Component</div>);

describe("Admin Component", () => {
    test("renders admin page and default section is dashboard", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        // Check sidebar header
        expect(screen.getByText("Admin Page")).toBeInTheDocument();
        // Default section is dashboard
        expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    test("switches to Rental section when clicking Active rentals", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        const rentalButton = screen.getByText("Active rentals");
        fireEvent.click(rentalButton);

        expect(screen.getByTestId("rental")).toBeInTheDocument();
    });

    test("switches to Stock section when clicking Current Stock", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        const stockButton = screen.getByText("Current Stock");
        fireEvent.click(stockButton);

        expect(screen.getByTestId("stock")).toBeInTheDocument();
    });

    test("switches to Booking section when clicking Booking", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        const bookingButton = screen.getByText("Booking");
        fireEvent.click(bookingButton);

        expect(screen.getByTestId("booking")).toBeInTheDocument();
    });

    test("sidebar buttons toggle active class correctly", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        const dashboardButton = screen.getByRole("button", { name: /Dashboard/i });
        const rentalButton = screen.getByRole("button", { name: /Active rentals/i });

        // Dashboard should be active by default
        expect(dashboardButton).toHaveClass("active");

        // Click rental button
        fireEvent.click(rentalButton);

        // Rental should now be active, dashboard should not
        expect(rentalButton).toHaveClass("active");
        expect(dashboardButton).not.toHaveClass("active");
    });
});
