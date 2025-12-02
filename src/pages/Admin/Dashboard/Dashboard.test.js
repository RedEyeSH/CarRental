import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Dashboard from "./Dashboard";

// Mock KPI cards and LineChart
jest.mock("../../../components/KPICard/KPICard.jsx", () => () => <div data-testid="kpi-card" />);
jest.mock("../../../components/LineChart/LineChart.jsx", () => () => <div data-testid="line-chart" />);

// Mock data and fetch responses
const mockBookings = [
    { id: 1, total_price: 100, created_at: "2025-01-01T12:00:00Z" },
    { id: 2, total_price: 200, created_at: "2025-01-02T12:00:00Z" },
];
const mockCars = [
    { id: 1, brand: "Toyota", model: "Corolla", rental_count: 5 },
    { id: 2, brand: "Ford", model: "Focus", rental_count: 3 },
];

describe("Dashboard Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("token", "fake-token");

        // Mock fetch for both endpoints
        global.fetch = jest.fn((url) => {
            if (url.includes("/bookings")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockBookings),
                });
            }
            if (url.includes("/cars")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockCars),
                });
            }
            return Promise.reject("Unknown URL");
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders the dashboard header", async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
        expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
    });

    test("renders KPI cards", async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        const kpiCards = screen.getAllByTestId("kpi-card");
        expect(kpiCards.length).toBeGreaterThan(0);
    });

    test("renders the revenue chart section with total revenue", async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        expect(screen.getByText("Revenue Generated")).toBeInTheDocument();

        await waitFor(() => {
            const totalRevenueEl = screen.getByText(/Total:/);
            expect(totalRevenueEl).toHaveTextContent(/300/);
            expect(totalRevenueEl).toHaveTextContent(/€/);
        });

        expect(screen.getAllByTestId("line-chart").length).toBeGreaterThanOrEqual(1);
    });

    test("renders the car rental count chart section", async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        await waitFor(() => {
            expect(screen.getByText("Car Rental Count")).toBeInTheDocument();
        });

        const charts = screen.getAllByTestId("line-chart");
        expect(charts.length).toBeGreaterThanOrEqual(2); // Revenue + Car rental chart
    });
});