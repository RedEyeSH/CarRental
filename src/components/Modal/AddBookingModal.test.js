import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddBookingModal from "./AddBookingModal";
import { cars, bookingApi } from "../../data/mockData";

// Mock bookingApi
jest.mock("../../data/mockData.js", () => {
    const originalModule = jest.requireActual("../../data/mockData.js");
    return {
        ...originalModule,
        bookingApi: {
            create: jest.fn(),
        },
    };
});

describe("AddBookingModal", () => {
    const onCloseMock = jest.fn();
    const onAddMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders modal with all input fields", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        expect(screen.getByRole("heading", { name: /Add Booking/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Add Booking/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

        expect(container.querySelector('input[name="user"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="car"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="start_date"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="end_date"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="total_price"]')).toBeInTheDocument();
        expect(container.querySelector('select[name="payment_status"]')).toBeInTheDocument();
    });

    test("updates input values on change", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const userInput = container.querySelector('input[name="user"]');
        const carInput = container.querySelector('input[name="car"]');

        fireEvent.change(userInput, { target: { value: "John Doe" } });
        fireEvent.change(carInput, { target: { value: cars[0].name } });

        expect(userInput.value).toBe("John Doe");
        expect(carInput.value).toBe(cars[0].name);
    });

    test("calculates total price correctly", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const carInput = container.querySelector('input[name="car"]');
        const startDateInput = container.querySelector('input[name="start_date"]');
        const endDateInput = container.querySelector('input[name="end_date"]');
        const totalPriceInput = container.querySelector('input[name="total_price"]');

        const car = cars[0];

        fireEvent.change(carInput, { target: { value: car.name } });
        fireEvent.change(startDateInput, { target: { value: "2025-10-01" } });
        fireEvent.change(endDateInput, { target: { value: "2025-10-04" } });

        // Total days = 3, price per day = car.price
        expect(Number(totalPriceInput.value)).toBe(3 * car.price);
    });

    test("calls bookingApi.create and callbacks on form submit", async () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const userInput = container.querySelector('input[name="user"]');
        const carInput = container.querySelector('input[name="car"]');
        const startDateInput = container.querySelector('input[name="start_date"]');
        const endDateInput = container.querySelector('input[name="end_date"]');

        const car = cars[0];

        fireEvent.change(userInput, { target: { value: "John Doe" } });
        fireEvent.change(carInput, { target: { value: car.name } });
        fireEvent.change(startDateInput, { target: { value: "2025-10-01" } });
        fireEvent.change(endDateInput, { target: { value: "2025-10-03" } });

        const createdBooking = {
            user: "John Doe",
            car: car.name,
            start_date: "2025-10-01",
            end_date: "2025-10-03",
            total_price: 2 * car.price,
            payment_status: "PENDING",
        };

        bookingApi.create.mockResolvedValueOnce(createdBooking);

        const submitButton = screen.getByRole("button", { name: /Add Booking/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(bookingApi.create).toHaveBeenCalledWith(expect.objectContaining({
                user: "John Doe",
                car: car.name
            }));
            expect(onAddMock).toHaveBeenCalledWith(createdBooking);
            expect(onCloseMock).toHaveBeenCalled();
        });
    });

    test("closes modal when clicking overlay", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const overlay = container.querySelector(".overlay");
        fireEvent.click(overlay);
        expect(onCloseMock).toHaveBeenCalled();
    });

    test("does not close modal when clicking inside modal content", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const modal = container.querySelector(".modal");
        fireEvent.click(modal);
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    test("closes modal when clicking cancel button", () => {
        const { container } = render(
            <AddBookingModal onClose={onCloseMock} onAdd={onAddMock} />
        );

        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        fireEvent.click(cancelButton);
        expect(onCloseMock).toHaveBeenCalled();
    });
});
