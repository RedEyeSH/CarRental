import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Users from "./Users";

describe("Users Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
    });

    test("renders loading state initially", async () => {
        render(<Users />);

        expect(screen.getByText("Loading users...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText("Loading users...")).not.toBeInTheDocument();
        });
    });

    test("renders error message when fetch fails", async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Failed to fetch users"))
        );

        render(<Users />);

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
        });
    });

    test("renders users table when fetch is successful", async () => {
        const mockUsers = [
            {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "123-456-7890",
                role: "Admin",
                created_at: "2023-01-01T12:00:00Z",
            },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUsers),
            })
        );

        render(<Users />);

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
            expect(screen.getByText("123-456-7890")).toBeInTheDocument();
            expect(screen.getByText("Admin")).toBeInTheDocument();
        });
    });

    test("filters users based on search term", async () => {
        const mockUsers = [
            { id: 1, name: "John Doe", email: "john.doe@example.com" },
            { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUsers),
            })
        );

        render(<Users />);

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText("Search by name or email"), {
            target: { value: "Jane" },
        });

        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    test("opens and closes modals on button clicks", async () => {
        const listUser = { id: 1, name: "List User", email: "list@example.com" };
        const modalUser = { id: 1, name: "Modal Details User", email: "modal@example.com" };

        global.fetch = jest.fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve([listUser]) })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(modalUser) })
            );

        render(<Users />);

        await waitFor(() => {
            expect(screen.getByText("List User")).toBeInTheDocument();
        });

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        expect(screen.getByText("User Details")).toBeInTheDocument();

        await screen.findByText("Modal Details User");

        fireEvent.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(screen.queryByText("User Details")).not.toBeInTheDocument();
        });
    });
});