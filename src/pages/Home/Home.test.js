import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { cars } from "../../data/mockData.js";

jest.mock("../../data/mockData.js", () => ({
    cars: [
        { id: 1, name: "Car A", price: 100, image: "car-a.jpg", imageName: "Car A" },
        { id: 2, name: "Car B", price: 200, image: "car-b.jpg", imageName: "Car B" },
        { id: 3, name: "Car C", price: 300, image: "car-c.jpg", imageName: "Car C" },
    ],
}));

describe("Home Component", () => {
    test("renders the Home component", () => {
        render(<Home />);
        expect(screen.getByText("Keywords")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });

    test("filters cars based on search input", () => {
        render(<Home />);
        const searchInput = screen.getByPlaceholderText("Search");

        expect(screen.getByText("Car A")).toBeInTheDocument();
        expect(screen.getByText("Car B")).toBeInTheDocument();
        expect(screen.getByText("Car C")).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "Car A" } });
        expect(screen.getByText("Car A")).toBeInTheDocument();
        expect(screen.queryByText("Car B")).not.toBeInTheDocument();
        expect(screen.queryByText("Car C")).not.toBeInTheDocument();
    });

    test("renders car cards correctly", () => {
        render(<Home />);
        const carCards = screen.getAllByRole("img");
        expect(carCards).toHaveLength(cars.length);
        expect(screen.getByAltText("Car A")).toBeInTheDocument();
        expect(screen.getByAltText("Car B")).toBeInTheDocument();
        expect(screen.getByAltText("Car C")).toBeInTheDocument();
    });
});