import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RemoveCarModal from "./RemoveCarModal";

describe("RemoveCarModal", () => {
    const car = { id: 1, title: "Tesla Model S" };
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(<RemoveCarModal car={car} onCancel={onCancel} onConfirm={onConfirm} />);
    });

    test("renders modal with car title", () => {
        expect(
            screen.getByText((content, element) => {
                const hasText = (node) => node.textContent === "Are you sure you want to delete Tesla Model S?";
                const elementHasText = hasText(element);
                const childrenDontHaveText = Array.from(element?.children || []).every((child) => !hasText(child));
                return elementHasText && childrenDontHaveText;
            })
        ).toBeInTheDocument();
    });

    test("clicking Cancel button calls onCancel", () => {
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test("clicking Delete button calls onConfirm with car id", () => {
        fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
        expect(onConfirm).toHaveBeenCalledWith(car.id);
    });

    test("clicking overlay calls onCancel", () => {
        fireEvent.click(screen.getByText(/Confirm Deletion/i).closest(".overlay"));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test("clicking inside modal does not trigger onCancel", () => {
        fireEvent.click(screen.getByText(/Confirm Deletion/i)); // inside modal
        expect(onCancel).not.toHaveBeenCalled();
    });
});
