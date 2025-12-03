import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Payment from "./Payment";

// Mock FontAwesome if your component uses it
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("Payment Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders loading state initially", () => {
    // Mock a promise that never resolves to test loading state
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<Payment />);
    expect(screen.getByText(/loading payments/i)).toBeInTheDocument();
  });

  test("renders error message on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch payment"));

    render(<Payment />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch payment/i)).toBeInTheDocument();
    });
  });

  test("renders payment table with data", async () => {
    const mockPayments = [
      {
        id: 1,
        booking_id: "B123",
        amount: 100,
        method: "Credit Card",
        payment_date: "2023-10-01T15:00:00Z",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayments,
    });

    render(<Payment />);

    await waitFor(() => {
      expect(screen.getByText(/payments/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/b123/i)).toBeInTheDocument();
    // Use regex to be flexible about currency symbols (e.g. 100€ vs $100)
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/credit card/i)).toBeInTheDocument();

    // Note: This date format depends on your local timezone or how the component formats it.
    // Ensure this string matches what your component actually outputs.
    expect(screen.getByText(/01\/10\/2023/i)).toBeInTheDocument();
  });

  test("renders 'No payments found' when no data matches the search", async () => {
    const mockPayments = [
      {
        id: 1,
        booking_id: "B123",
        amount: 100,
        method: "Credit Card",
        payment_date: "2023-10-01T15:00:00Z",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayments,
    });

    render(<Payment />);

    await waitFor(() => {
      expect(screen.getByText(/payments/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by user, amount, status, date, or id/i);

    fireEvent.change(searchInput, {
      target: { value: "Nonexistent" },
    });

    expect(screen.getByText(/no payments found/i)).toBeInTheDocument();
  });
});