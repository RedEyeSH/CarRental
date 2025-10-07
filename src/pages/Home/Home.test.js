import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

describe("Home component", () => {
    const navigateMock = jest.fn();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    beforeAll(() => {
        // Mock the fetch API with expected data
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { id: 1, name: "Tesla Model S" },
                    { id: 2, name: "Ford Mustang" },
                ]), // Mocked response data
            })
        );
    });

    afterAll(() => {
        // Clean up the fetch mock
        global.fetch.mockClear();
        delete global.fetch;
    });

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