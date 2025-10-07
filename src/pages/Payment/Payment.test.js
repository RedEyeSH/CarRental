import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Payment from "./Payment";

// define the mockLocation at top level and initialize it
let mockLocation = { state: {} };
const mockNavigate = jest.fn();

// mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

describe("Payment Component", () => {
    const mockCar = {
        id: 1,
        brand: "Brand A",
        model: "Model A",
        year: "2020",
        price_per_day: 50,
        image: "car-a.jpg",
    };

    const renderWithRouter = (state = {}) => {
        // ✅ ensure state is set before rendering
        mockLocation.state = state;

        return render(
            <MemoryRouter initialEntries={["/payment"]}>
                <Routes>
                    <Route path="/payment" element={<Payment />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly with valid car data", () => {
        renderWithRouter({
            car: mockCar,
            startDate: "2023-10-01",
            endDate: "2023-10-05",
        });

        // the icon may split text, so we use a more flexible matcher
        expect(screen.getByRole("heading", { name: /Checkout/i })).toBeInTheDocument();
        expect(screen.getByText(/Brand A Model A \(2020\)/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue("€200.00")).toBeInTheDocument();
    });

    test("redirects when car data is missing", () => {
        renderWithRouter({});
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("calculates total cost correctly", () => {
        renderWithRouter({
            car: mockCar,
            startDate: "2023-10-01",
            endDate: "2023-10-03",
        });

        expect(screen.getByDisplayValue("€100.00")).toBeInTheDocument();
    });

    test("handles form submission", () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

        renderWithRouter({
            car: mockCar,
            startDate: "2023-10-01",
            endDate: "2023-10-05",
        });

        const button = screen.getByRole("button", { name: /Confirm Payment/i });
        fireEvent.click(button);

        expect(alertMock).toHaveBeenCalledWith("Payment successful for €200.00 via Credit Card");
        expect(mockNavigate).toHaveBeenCalledWith("/");

        alertMock.mockRestore();
    });

    test("changes payment method", () => {
        renderWithRouter({
            car: mockCar,
            startDate: "2023-10-01",
            endDate: "2023-10-05",
        });

        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "PayPal" } });

        expect(select.value).toBe("PayPal");
    });
});
