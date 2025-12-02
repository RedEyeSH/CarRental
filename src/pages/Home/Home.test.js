import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                "home.searchPlaceholder": "Enter car name...",
            };
            return translations[key] || key;
        },
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));

describe("Home component", () => {
    const navigateMock = jest.fn();

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