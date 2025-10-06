import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

jest.mock("../../../components/KPICard/KPICard.jsx", () => () => <div data-testid="kpi-card" />);
jest.mock("../../../components/LineChart/LineChart.jsx", () => () => <div data-testid="line-chart" />);

describe("Dashboard Component", () => {
    test("renders the dashboard header", () => {
        render(<Dashboard />);
        expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
        expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
    });

    test("renders KPI cards", () => {
        render(<Dashboard />);
        const kpiCards = screen.getAllByTestId("kpi-card");
        expect(kpiCards.length).toBeGreaterThan(0);
    });

    test("renders the line chart section", () => {
        render(<Dashboard />);
        expect(screen.getByText("Revenue Generated")).toBeInTheDocument();
        expect(screen.getByText("$5,000")).toBeInTheDocument();
        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    test("renders the transaction section", () => {
        const { container } = render(<Dashboard />);
        const transactionSection = container.querySelector(".admin-transaction");
        expect(transactionSection).toBeInTheDocument();
    });
});
