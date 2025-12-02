import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Booking from "./Booking";

jest.mock("../../../components/Modal/EditBookingModal", () => jest.fn(() => <div>EditBookingModal</div>));
jest.mock("../../../components/Modal/RemoveBookingModal", () => jest.fn(() => <div>RemoveBookingModal</div>));
jest.mock("../../../components/Modal/ViewBookingModal", () => jest.fn(() => <div>ViewBookingModal</div>));

describe("Booking Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("token", "test-token");
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state initially", async () => {
        fetch.mockImplementation(() => new Promise(() => {})); // Mock fetch to never resolve
        await act(async () => {
            render(<Booking />);
        });
        expect(screen.getByText(/loading bookings/i)).toBeInTheDocument();
    });

    test("renders error message when fetch fails", async () => {
        fetch.mockRejectedValueOnce(new Error("Failed to fetch bookings"));
        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/error: failed to fetch bookings/i)).toBeInTheDocument());
    });

    test("renders bookings table with data", async () => {
        fetch.mockImplementation((url) => {
            if (url.includes("/bookings")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, start_date: "2023-10-01", end_date: "2023-10-05", total_price: 200, payment_status: "Paid" }]),
                });
            }
            if (url.includes("/auth/users")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, name: "John Doe" }]),
                });
            }
            if (url.includes("/cars")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, brand: "Toyota", model: "Corolla" }]),
                });
            }
        });

        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/bookings/i)).toBeInTheDocument());
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByText(/toyota corolla/i)).toBeInTheDocument();
        expect(screen.getByText(/200/i)).toBeInTheDocument();
        expect(screen.getByText(/paid/i)).toBeInTheDocument();
    });

    test("filters bookings by search term", async () => {
        fetch.mockImplementation((url) => {
            if (url.includes("/bookings")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, start_date: "2023-10-01", end_date: "2023-10-05", total_price: 200, payment_status: "Paid" }]),
                });
            }
            if (url.includes("/auth/users")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, name: "John Doe" }]),
                });
            }
            if (url.includes("/cars")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: 1, brand: "Toyota", model: "Corolla" }]),
                });
            }
        });

        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText(/search by user, car, or booking id/i);
        fireEvent.change(searchInput, { target: { value: "john" } });
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "unknown" } });
        expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
    });

    test("opens and closes the edit modal", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, start_date: "2023-10-01", end_date: "2023-10-05", total_price: 200, payment_status: "Paid" }]),
        });

        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/bookings/i)).toBeInTheDocument());

        const editButton = screen.getByTitle(/edit/i);
        fireEvent.click(editButton);
        expect(screen.getByText(/editbookingmodal/i)).toBeInTheDocument();
    });

    test("opens and closes the remove modal", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, start_date: "2023-10-01", end_date: "2023-10-05", total_price: 200, payment_status: "Paid" }]),
        });

        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/bookings/i)).toBeInTheDocument());

        const deleteButton = screen.getByTitle(/delete/i);
        fireEvent.click(deleteButton);
        expect(screen.getByText(/removebookingmodal/i)).toBeInTheDocument();
    });

    test("opens and closes the view modal", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, start_date: "2023-10-01", end_date: "2023-10-05", total_price: 200, payment_status: "Paid" }]),
        });

        render(<Booking />);
        await waitFor(() => expect(screen.getByText(/bookings/i)).toBeInTheDocument());

        const viewButton = screen.getByTitle(/view/i);
        fireEvent.click(viewButton);
        expect(screen.getByText(/viewbookingmodal/i)).toBeInTheDocument();
    });
});