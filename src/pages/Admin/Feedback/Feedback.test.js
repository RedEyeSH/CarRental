import React from "react";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import Feedbacks from "./Feedback";

// Helper to simulate successful API responses
const mockSuccessResponse = (url) => {
    if (url.includes("/feedbacks")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, user_id: 1, car_id: 1, comment: "Great car!", rating: 5, created_at: "2023-10-01T12:00:00Z" }]),
        });
    }
    if (url.includes("/auth/users")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, first_name: "John", last_name: "Doe" }]),
        });
    }
    if (url.includes("/cars")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, brand: "Toyota", model: "Corolla" }]),
        });
    }
    return Promise.reject(new Error("Unknown URL"));
};

describe("Feedbacks Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("token", "test-token");
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state initially", async () => {
        // Mock fetch to return a Promise that never resolves (simulates stuck loading)
        fetch.mockImplementation(() => new Promise(() => {}));

        await act(async () => {
            render(<Feedbacks />);
        });
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("renders error message when fetch fails", async () => {
        fetch.mockImplementation(() => Promise.reject(new Error("Failed to fetch feedbacks")));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await act(async () => {
            render(<Feedbacks />);
        });

        await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());

        consoleSpy.mockRestore();
    });

    test("renders feedbacks table with data", async () => {
        fetch.mockImplementation(mockSuccessResponse);

        await act(async () => {
            render(<Feedbacks />);
        });

        await waitFor(() => expect(screen.getByText(/feedback/i)).toBeInTheDocument());

        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByText(/toyota corolla/i)).toBeInTheDocument();
        expect(screen.getByText(/great car!/i)).toBeInTheDocument();

        expect(screen.getByText(/^5$/)).toBeInTheDocument();
    });

    test("opens and closes the delete modal", async () => {
        fetch.mockImplementation(mockSuccessResponse);

        await act(async () => {
            render(<Feedbacks />);
        });

        await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument());

        const deleteButton = screen.getByTitle(/delete/i) || screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(screen.getByText(/delete feedback/i)).toBeInTheDocument();

        const cancelButton = screen.getByText(/cancel/i);
        fireEvent.click(cancelButton);

        expect(screen.queryByText(/delete feedback/i)).not.toBeInTheDocument();
    });
});