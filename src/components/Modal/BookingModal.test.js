import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n"; // Assuming you have an i18n setup
import BookingModal from "./BookingModal";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("BookingModal", () => {
  const mockCar = {
    brand: "Toyota",
    model: "Corolla",
    price_per_day: 50,
    image: "car.jpg",
  };
  const mockStartDate = "2023-10-01";
  const mockEndDate = "2023-10-05";
  const mockOnClose = jest.fn();

  const renderComponent = () =>
      render(
          <MemoryRouter>
            <I18nextProvider i18n={i18n}>
              <BookingModal
                  car={mockCar}
                  startDate={mockStartDate}
                  endDate={mockEndDate}
                  onClose={mockOnClose}
              />
            </I18nextProvider>
          </MemoryRouter>
      );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("renders modal with correct details", () => {
    renderComponent();

    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("€50")).toBeInTheDocument();

    expect(
        screen.getByText((content, element) => {
          const hasText = (node) => node.textContent === "4 Days";
          const nodeHasText = hasText(element);
          const childrenDontHaveText = Array.from(element?.children || []).every(
              (child) => !hasText(child)
          );
          return nodeHasText && childrenDontHaveText;
        })
    ).toBeInTheDocument();

    expect(screen.getByText("€200.00")).toBeInTheDocument();
    expect(screen.getByText(mockStartDate)).toBeInTheDocument();
    expect(screen.getByText(mockEndDate)).toBeInTheDocument();
  });

  test("calls onClose when clicking outside the modal", () => {
    renderComponent();

    const overlay = document.querySelector(".booking-modal-overlay");
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("does not call onClose when clicking inside the modal", () => {
    renderComponent();

    const modal = document.querySelector(".booking-modal");

    const clickEvent = new MouseEvent("click", { bubbles: true });
    clickEvent.stopPropagation = jest.fn();

    modal.dispatchEvent(clickEvent);

    expect(clickEvent.stopPropagation).toHaveBeenCalled();

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("navigates to payment page with correct state on confirm", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Confirm Booking"));
    expect(mockNavigate).toHaveBeenCalledWith("/payment", {
      state: {
        car: mockCar,
        startDate: mockStartDate,
        endDate: mockEndDate,
        totalPrice: 200,
      },
    });
  });

  test("calls onClose when cancel button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});