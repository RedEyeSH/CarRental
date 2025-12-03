import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Payment from "./Payment";

// ---------- Mock react-router-dom hooks ----------
let mockLocation = { state: {} };
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

// ---------- Mock i18next ----------
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                "payment.confirmPayment": "Confirm Payment",
                "payment.methodCard": "Credit Card",
                "payment.methodCash": "Cash",
                "payment.methodOnline": "Online",
                "payment.checkout": "Checkout",
                "payment.startDate": "Start Date",
                "payment.endDate": "End Date",
                "payment.rentalDuration": "Rental Duration",
                "payment.totalCost": "Total Cost",
                "payment.paymentDetails": "Payment Details",
                "payment.paymentMethod": "Payment Method",
            };
            return translations[key] || key;
        },
    }),
}));

// ---------- Mock AuthContext ----------
const mockUser = { name: "Test User" };
const AuthContext = React.createContext();
jest.mock("../../contexts/AuthContext", () => {
    const React = require("react");
    return {
        AuthContext: React.createContext({ user: { name: "Test User" } }),
    };
});

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
        mockLocation.state = state;

        return render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <MemoryRouter initialEntries={["/payment"]}>
                    <Routes>
                        <Route path="/payment" element={<Payment />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
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

        expect(alertMock).toHaveBeenCalledWith("payment.alerts.userNotLoggedIn");

        alertMock.mockRestore();
    });

    test("changes payment method", () => {
        renderWithRouter({
            car: mockCar,
            startDate: "2023-10-01",
            endDate: "2023-10-05",
        });

        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "Online" } }); // Use the translated value

        expect(select.value).toBe("Online"); // Match the translated value #2
    });
});