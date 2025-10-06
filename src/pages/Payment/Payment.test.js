import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Payment from "./Payment";
import { cars as mockCars } from "../../data/mockData";

jest.mock("../../data/mockData", () => ({
    cars: [
        { id: 1, name: "Car A", model: "Model A", price: 50, image: "car-a.jpg", brand: "Brand A", creationDate: "2020" },
        { id: 2, name: "Car B", model: "Model B", price: 70, image: "car-b.jpg", brand: "Brand B", creationDate: "2021" },
    ],
}));

describe("Payment Component", () => {
    const renderWithRouter = (ui, { route = "/" } = {}) => {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="/payment/:bookingId" element={ui} />
                </Routes>
            </MemoryRouter>
        );
    };

    test("renders correctly with valid car data", () => {
        renderWithRouter(<Payment />, { route: "/payment/1?start=2023-10-01&end=2023-10-05" });

        expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
        expect(screen.getByText(/Car A Model A \(2020\)/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/€200.00/i)).toBeInTheDocument(); // Use getByDisplayValue for input values
    });

    test("shows error message for invalid car data", () => {
        renderWithRouter(<Payment />, { route: "/payment/999?start=2023-10-01&end=2023-10-05" });

        expect(screen.getByText(/Car not found or invalid booking/i)).toBeInTheDocument();
    });

    test("calculates total cost correctly", () => {
        renderWithRouter(<Payment />, { route: "/payment/1?start=2023-10-01&end=2023-10-03" });

        expect(screen.getByDisplayValue(/€100.00/i)).toBeInTheDocument(); // Use getByDisplayValue for input values
    });

    test("handles form submission", () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

        renderWithRouter(<Payment />, { route: "/payment/1?start=2023-10-01&end=2023-10-05" });

        const button = screen.getByText(/Confirm Payment/i);
        fireEvent.click(button);

        expect(alertMock).toHaveBeenCalledWith("Payment successful for €200.00 via Credit Card");

        alertMock.mockRestore();
    });

    test("changes payment method", () => {
        renderWithRouter(<Payment />, { route: "/payment/1?start=2023-10-01&end=2023-10-05" });

        const select = screen.getByLabelText(/Payment Method/i);
        fireEvent.change(select, { target: { value: "PayPal" } });

        expect(select.value).toBe("PayPal");
    });
});