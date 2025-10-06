import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Dashboard Component", () => {
    test("renders the dashboard header", () => {
        render(<Dashboard />);
        expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
        expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
    });

    test("renders KPI cards", () => {
        render(<Dashboard />);
        const kpiCards = screen.getAllByTestId("kpi-card"); // Assuming KPICard has a data-testid="kpi-card"
        expect(kpiCards.length).toBeGreaterThan(0);
    });

    test("renders the line chart", () => {
        render(<Dashboard />);
        expect(screen.getByText("Revenue Generated")).toBeInTheDocument();
        expect(screen.getByText("$5,000")).toBeInTheDocument();
    });

    test("renders the transaction section", () => {
        render(<Dashboard />);
        const transactionSection = screen.getByClassName("admin-transaction");
        expect(transactionSection).toBeInTheDocument();
    });
});