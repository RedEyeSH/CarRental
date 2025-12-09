import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import RemoveUserModal from "./RemoveUserModal";

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
    },
}));

describe("RemoveUserModal", () => {
    const mockOnClose = jest.fn();
    const mockOnUserDeleted = jest.fn();
    const mockUserId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
        mockOnClose.mockClear();
    });

    test("renders correctly when isOpen is true", () => {
        render(
            <RemoveUserModal
                isOpen={true}
                onClose={mockOnClose}
                onUserDeleted={mockOnUserDeleted}
                userId={mockUserId}
            />
        );

        expect(screen.getByText("Delete User")).toBeInTheDocument();
        expect(
            screen.getByText("Are you sure you want to delete this user? This action cannot be undone.")
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    test("does not render when isOpen is false", () => {
        render(
            <RemoveUserModal
                isOpen={false}
                onClose={mockOnClose}
                onUserDeleted={mockOnUserDeleted}
                userId={mockUserId}
            />
        );

        expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
    });

    test("calls onClose when Cancel button is clicked", () => {
        render(
            <RemoveUserModal
                isOpen={true}
                onClose={mockOnClose}
                onUserDeleted={mockOnUserDeleted}
                userId={mockUserId}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("calls onUserDeleted and shows success toast on successful delete", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        );

        render(
            <RemoveUserModal
                isOpen={true}
                onClose={mockOnClose}
                onUserDeleted={mockOnUserDeleted}
                userId={mockUserId}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(mockOnUserDeleted).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("User deleted successfully!");
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    test("displays error message on failed delete", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        render(
            <RemoveUserModal
                isOpen={true}
                onClose={mockOnClose}
                onUserDeleted={mockOnUserDeleted}
                userId={mockUserId}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(screen.getByText("Failed to delete user")).toBeInTheDocument();
            expect(mockOnUserDeleted).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });
});