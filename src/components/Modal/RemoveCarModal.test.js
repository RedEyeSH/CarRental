import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RemoveCarModal from "./RemoveCarModal";

describe("RemoveCarModal", () => {
  const mockCar = { id: 1, title: "Test Car" };
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with car data", () => {
    render(<RemoveCarModal car={mockCar} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />);
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
        screen.getByText((content, element) =>
            content.startsWith("Are you sure you want to delete") &&
            element.textContent.includes(mockCar.title)
        )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  test("calls onCancel when Cancel button is clicked", () => {
    render(<RemoveCarModal car={mockCar} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("calls onCancel when overlay is clicked", () => {
    render(<RemoveCarModal car={mockCar} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByText("Confirm Deletion").closest(".overlay"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("calls onConfirm with car id when Delete button is clicked", () => {
    render(<RemoveCarModal car={mockCar} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mockOnConfirm).toHaveBeenCalledWith(mockCar.id);
  });
});