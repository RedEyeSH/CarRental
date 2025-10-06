import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stock from "./Stock";

describe("Stock Component", () => {
    test("renders the sidebar with locations", () => {
        render(<Stock />);
        const locations = ["Helsinki", "Tampere", "Espoo", "Vantaa"];
        locations.forEach((location) => {
            expect(screen.getByText(location)).toBeInTheDocument();
        });
    });

    test("renders the navbar with options", () => {
        render(<Stock />);
        const options = ["Filter", "Add Car"];
        options.forEach((option) => {
            expect(screen.getByText(option)).toBeInTheDocument();
        });
    });

    test("renders the search input", () => {
        render(<Stock />);
        const searchInput = screen.getByPlaceholderText("Search...");
        expect(searchInput).toBeInTheDocument();
    });

    test("renders the stock table with mock data", () => {
        render(<Stock />);
        expect(screen.getByText("Fiat 500 for 5 days in Helsinki")).toBeInTheDocument();
        expect(screen.getByText("100€/day")).toBeInTheDocument();
    });

    test("toggles active option in navbar", () => {
        render(<Stock />);
        const filterOption = screen.getByText("Filter");
        expect(filterOption.closest("button")).toHaveClass("active");
        fireEvent.click(filterOption);
        expect(filterOption.closest("button")).not.toHaveClass("active");
        const addCarOption = screen.getByText("Add Car");
        expect(addCarOption.closest("button")).toHaveClass("stock-navbar-option");
    });


    test("renders the checkbox for availability", () => {
        render(<Stock />);
        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes.length).toBeGreaterThan(0);
    });
});