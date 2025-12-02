import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSelector from "./LanguageSelector";
import i18n from "../../i18n";

jest.mock("../../i18n", () => ({
    changeLanguage: jest.fn(() => Promise.resolve()),
    language: "en",
}));

describe("LanguageSelector", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
    });

    test("renders the language selector with all supported languages", () => {
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);
        expect(select).toBeInTheDocument();

        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(4); // Number of supported languages
        expect(options.map((opt) => opt.textContent)).toEqual([
            "English",
            "日本語 / Japanese",
            "Русский / Russian",
            "العربية / Arabic",
        ]);
    });

    test("sets the initial language based on localStorage", () => {
        localStorage.setItem("lang", "ja");
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);
        expect(select.value).toBe("ja");
    });

    test("sets the initial language based on i18n.language if localStorage is empty", () => {
        i18n.language = "ru";
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);
        expect(select.value).toBe("ru");
    });

    test("defaults to 'en' if no language is set in localStorage or i18n", () => {
        i18n.language = null;
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);
        expect(select.value).toBe("en");
    });

    test("changes the language and updates i18n and document attributes", async () => {
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);

        fireEvent.change(select, { target: { value: "ar" } });

        expect(select.value).toBe("ar");
        expect(i18n.changeLanguage).toHaveBeenCalledWith("ar");

        // Wait for the effect to apply changes
        await Promise.resolve();

        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(localStorage.getItem("lang")).toBe("ar");
    });

    test("handles left-to-right languages correctly", async () => {
        render(<LanguageSelector />);
        const select = screen.getByLabelText(/select language/i);

        fireEvent.change(select, { target: { value: "en" } });

        expect(select.value).toBe("en");
        expect(i18n.changeLanguage).toHaveBeenCalledWith("en");

        // Wait for the effect to apply changes
        await Promise.resolve();

        expect(document.documentElement.lang).toBe("en");
        expect(document.documentElement.dir).toBe("ltr");
        expect(localStorage.getItem("lang")).toBe("en");
    });

    test("applies custom className if provided", () => {
        render(<LanguageSelector className="custom-class" />);
        const select = screen.getByLabelText(/select language/i);
        expect(select).toHaveClass("custom-class");
    });
});