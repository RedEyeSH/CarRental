import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewUserModal from "./ViewUserModal";

describe("ViewUserModal", () => {
    const mockOnClose = jest.fn();
    const mockUserId = 1;

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );
        jest.clearAllMocks();
    });

    test("does not render when isOpen is false", () => {
        render(<ViewUserModal isOpen={false} onClose={mockOnClose} userId={mockUserId} />);
        expect(screen.queryByText("User Details")).not.toBeInTheDocument();
    });

    test("renders loading state when fetching user data", async () => {
        render(<ViewUserModal isOpen={true} onClose={mockOnClose} userId={mockUserId} />);

        expect(screen.getByText("Loading user data...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText("Loading user data...")).not.toBeInTheDocument();
        });
    });

    test("displays error message when fetching user data fails", async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Failed to fetch user data"))
        );

        render(<ViewUserModal isOpen={true} onClose={mockOnClose} userId={mockUserId} />);

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch user data")).toBeInTheDocument();
        });
    });

    test("displays user data when fetching is successful", async () => {
        const mockUser = {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            role: "Admin",
            created_at: "2023-01-01T12:00:00Z",
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUser),
            })
        );

        render(<ViewUserModal isOpen={true} onClose={mockOnClose} userId={mockUserId} />);

        const expectedDate = new Date(mockUser.created_at).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
            expect(screen.getByText("123-456-7890")).toBeInTheDocument();
            expect(screen.getByText("Admin")).toBeInTheDocument();
            expect(screen.getByText(expectedDate)).toBeInTheDocument();
        });
    });

    test("calls onClose when Close button is clicked", async () => {
        render(<ViewUserModal isOpen={true} onClose={mockOnClose} userId={mockUserId} />);

        const closeButton = screen.getByRole("button", { name: "Close" });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.queryByText("Loading user data...")).not.toBeInTheDocument();
        });
    });
});