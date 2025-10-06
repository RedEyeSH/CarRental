import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Booking from "./Booking";
import { bookingApi } from "../../data/mockData.js";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";


// Mock the API
jest.mock("../../data/mockData.js", () => ({
    bookingApi: {
        getAll: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock AddBookingModal
jest.mock("../../components/Modal/AddBookingModal.jsx", () => ({ onClose, onAdd }) => (
    <div data-testid="add-booking-modal">
        <button
            data-testid="modal-add-booking"
            onClick={() => onAdd({ id: 3, user: "Test User", car: "Car X", start_date: "2025-10-01", end_date: "2025-10-05", total_price: 500, payment_status: "Paid" })}
        >
            Add Booking
        </button>
        <button onClick={onClose}>Close</button>
    </div>
));

// Mock the SVG globally
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: ({ icon, ...props }) => {
        // Assign test IDs based on the icon prop's "iconName" field (common in FontAwesome)
        let testId = "icon";
        if (icon?.iconName === "trash") testId = "trash-icon";
        if (icon?.iconName === "plus") testId = "plus-icon";
        return <svg data-testid={testId} {...props} />;
    },
}));

describe("Booking Component", () => {
    beforeEach(() => {
        // Mock API responses
        bookingApi.getAll.mockResolvedValue([
            { id: 1, user: "Alice", car: "Car A", start_date: "2025-09-01", end_date: "2025-09-05", total_price: 100, payment_status: "Paid" },
            { id: 2, user: "Bob", car: "Car B", start_date: "2025-09-10", end_date: "2025-09-15", total_price: 200, payment_status: "Pending" },
        ]);
        bookingApi.delete.mockResolvedValue();
    });

    test("renders booking table with data from API", async () => {
        render(<Booking />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("Bob")).toBeInTheDocument();
        });

        // Check table headers
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("User")).toBeInTheDocument();
        expect(screen.getByText("Car")).toBeInTheDocument();
    });

    test("opens and closes AddBookingModal", async () => {
        render(<Booking />);

        // Open modal
        const addButton = screen.getByRole("button", { name: /Add Booking/i });
        fireEvent.click(addButton);

        // Verify modal is open
        expect(screen.getByTestId("add-booking-modal")).toBeInTheDocument();

        // Close modal
        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);

        // Verify modal is closed
        await waitFor(() => {
            expect(screen.queryByTestId("add-booking-modal")).not.toBeInTheDocument();
        });
    });

    test("adds a new booking via modal", async () => {
        render(<Booking />);

        // Open modal
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Add Booking/i }));
        });

        // Add booking
        act(() => {
            fireEvent.click(screen.getByTestId("modal-add-booking"));
        });

        // Verify new booking is added
        await waitFor(() => {
            expect(screen.getByText("Test User")).toBeInTheDocument();
            expect(screen.getByText("Car X")).toBeInTheDocument();
            expect(screen.getByText("€500")).toBeInTheDocument();
        });
    });

    test("deletes a booking after confirmation", async () => {
        window.confirm = jest.fn(() => true);

        render(<Booking />);

        await waitFor(() => {
            expect(screen.getByText("Alice")).toBeInTheDocument();
        });

        const deleteIcons = screen.getAllByTestId("trash-icon");

        fireEvent.click(deleteIcons[0]);

        await waitFor(() => {
            expect(screen.queryByText("Alice")).not.toBeInTheDocument();
        });
    });
});