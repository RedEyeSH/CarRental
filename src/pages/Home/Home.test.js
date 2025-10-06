import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { cars } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

describe("Home component", () => {
    const navigateMock = jest.fn();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    beforeEach(() => {
        useNavigate.mockReturnValue(navigateMock);
        jest.clearAllMocks();
    });

    test("renders search form inputs", () => {
        render(<Home />);

        expect(screen.getByPlaceholderText(/Enter car name.../i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter car name.../i)).toHaveAttribute("type", "text");
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
    });

    test("updates search input values", () => {
        render(<Home />);

        const searchInput = screen.getByPlaceholderText(/Enter car name.../i);
        fireEvent.change(searchInput, { target: { value: "Tesla" } });

        expect(searchInput.value).toBe("Tesla");
    });
});