import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "./Admin";

// Mock child components
jest.mock("./Dashboard/Dashboard.jsx", () => () => <div data-testid="dashboard">Dashboard Component</div>);
jest.mock("./Stock/Stock.jsx", () => () => <div data-testid="stock">Stock Component</div>);
jest.mock("./ActiveRentals/ActiveRentals.jsx", () => () => <div data-testid="rental">Rental Component</div>);
jest.mock("./Booking/Booking.jsx", () => () => <div data-testid="booking">Booking Component</div>);
jest.mock("./Users/Users.jsx", () => () => <div data-testid="users">Users Component</div>);
jest.mock("./Feedback/Feedback.jsx", () => () => <div data-testid="feedback">Feedback Component</div>);
jest.mock("./Payment/Payment.jsx", () => () => <div data-testid="payment">Payment Component</div>);

// Mock LoginModal so it doesn’t block rendering
jest.mock("../../components/Modal/LoginModal.jsx", () => () => (
    <div data-testid="login-modal">Login Modal</div>
));

beforeEach(() => {
    // Ensure tests always start with an admin user
    localStorage.setItem("user", JSON.stringify({ name: "AdminUser", role: "ADMIN" }));
    localStorage.setItem("token", "test-token");
});

afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

describe("Admin Component", () => {
    test("renders admin page and default section is dashboard", () => {
        render(
            <MemoryRouter>
                <Admin />
            </MemoryRouter>
        );

        // Sidebar header
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

        // Dashboard active by default
        expect(dashboardButton).toHaveClass("active");

        // Click rental button
        fireEvent.click(rentalButton);

        expect(rentalButton).toHaveClass("active");
        expect(dashboardButton).not.toHaveClass("active");
    });
});
