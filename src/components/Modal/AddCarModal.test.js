import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCarModal from "./AddCarModal";

describe("AddCarModal", () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the modal with all form fields', () => {
        render(<AddCarModal />);
        const addCarButton = screen.getByRole('button', { name: 'Add Car' });
        expect(addCarButton).toBeInTheDocument();
    });

    test("calls onClose when the overlay is clicked", () => {
        render(<AddCarModal onClose={mockOnClose} />);

        const overlay = screen.getByRole("button", { name: "Add Car" }).closest(".overlay");
        fireEvent.click(overlay);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("updates form fields on input change", () => {
        render(<AddCarModal onClose={mockOnClose} />);

        const inputs = screen.getAllByRole("textbox"); // Get all text input fields
        fireEvent.change(inputs[0], { target: { value: "Toyota" } }); // First input (Brand)
        expect(inputs[0].value).toBe("Toyota");

        fireEvent.change(inputs[1], { target: { value: "Corolla" } }); // Second input (Model)
        expect(inputs[1].value).toBe("Corolla");
    });
});