import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ViewBookingModal from "./ViewBookingModal";

// Mock localStorage
beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "mock-token");
});

// Reset fetch mocks
afterEach(() => {
    jest.resetAllMocks();
});

describe("ViewBookingModal", () => {
    const bookingId = 1;

    const mockBooking = {
        id: bookingId,
        user_id: 10,
        car_id: 20,
        start_date: "2025-12-01T00:00:00Z",
        end_date: "2025-12-05T00:00:00Z",
        payment_status: "PAID",
        created_at: "2025-11-01T12:34:56Z"
    };

    const mockUser = { id: 10, name: "John Doe" };
    const mockCar = { id: 20, brand: "Fiat", model: "500", license_plate: "HEL-1", image: "fiat.jpg" };

    test("does not render when isOpen is false", () => {
        render(<ViewBookingModal isOpen={false} bookingId={bookingId} onClose={() => {}} />);
        expect(screen.queryByText("Booking Details")).not.toBeInTheDocument();
    });

    test("renders loading state initially", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockBooking)
            })
        );

        render(<ViewBookingModal isOpen={true} bookingId={bookingId} onClose={() => {}} />);
        expect(screen.getByText("Loading booking data...")).toBeInTheDocument();
    });

    test("renders error if booking fetch fails", async () => {
        global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

        render(<ViewBookingModal isOpen={true} bookingId={bookingId} onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch booking data/i)).toBeInTheDocument();
        });
    });


    test("calls onClose when Close button is clicked", async () => {
        global.fetch = jest
            .fn()
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockBooking) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUser) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCar) });

        const handleClose = jest.fn();

        render(<ViewBookingModal isOpen={true} bookingId={bookingId} onClose={handleClose} />);

        await waitFor(() => screen.getByText("Close"));

        fireEvent.click(screen.getByText("Close"));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
