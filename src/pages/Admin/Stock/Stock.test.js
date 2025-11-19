import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Stock from "./Stock";

// Mock all modal components
jest.mock("../../../components/Modal/AddCarModal.jsx", () => ({ onClose, onCarAdded }) => (
    <div data-testid="add-modal">
        AddCarModal
        <button onClick={() => onCarAdded({ id: 3, brand: "Tesla", model: "Model 3" })}>Add Mock Car</button>
        <button onClick={onClose}>Close</button>
    </div>
));
jest.mock("../../../components/Modal/EditCarModal.jsx", () => ({ onClose }) => (
    <div data-testid="edit-modal">
        EditCarModal
        <button onClick={onClose}>Close</button>
    </div>
));
jest.mock("../../../components/Modal/RemoveCarModal.jsx", () => ({ onCancel, onConfirm, car }) => (
    <div data-testid="remove-modal">
        RemoveCarModal for {car.brand}
        <button onClick={() => onConfirm(car.id)}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
));
jest.mock("../../../components/Modal/ViewCarModal.jsx", () => ({ isOpen, onClose }) =>
    isOpen ? (
        <div data-testid="view-modal">
            ViewCarModal
            <button onClick={onClose}>Close</button>
        </div>
    ) : null
);

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");

    // Mock fetch with test data
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve([
                    {
                        id: 1,
                        brand: "Toyota",
                        model: "Corolla",
                        year: 2022,
                        type: "Sedan",
                        license_plate: "ABC-123",
                        status: "Available",
                        price_per_day: 50,
                        image: null,
                        created_at: "2024-04-15T12:00:00Z",
                    },
                    {
                        id: 2,
                        brand: "Ford",
                        model: "Focus",
                        year: 2020,
                        type: "Hatchback",
                        license_plate: "XYZ-789",
                        status: "Rented",
                        price_per_day: 40,
                        image: "car.png",
                        created_at: "2024-03-10T09:00:00Z",
                    },
                ]),
        })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Stock Component", () => {
    test("renders loading and then displays fetched cars", async () => {
        render(<Stock />);

        expect(screen.getByText("Loading cars...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Toyota")).toBeInTheDocument();
            expect(screen.getByText("Ford")).toBeInTheDocument();
        });
    });

    test("shows error message if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
        render(<Stock />);

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch cars")).toBeInTheDocument();
        });
    });

    test("filters cars when typing in search input", async () => {
        render(<Stock />);
        await waitFor(() => screen.getByText("Toyota"));

        const searchInput = screen.getByPlaceholderText("Search by brand, model, license plate, ...");
        fireEvent.change(searchInput, { target: { value: "Ford" } });

        expect(screen.queryByText("Toyota")).not.toBeInTheDocument();
        expect(screen.getByText("Ford")).toBeInTheDocument();
    });

    test("opens and closes AddCarModal", async () => {
        render(<Stock />);
        await waitFor(() => screen.getByText("Toyota"));

        const addButton = screen.getByText("Add Car");
        fireEvent.click(addButton);

        expect(screen.getByTestId("add-modal")).toBeInTheDocument();

        // Add mock car
        fireEvent.click(screen.getByText("Add Mock Car"));
        await waitFor(() => {
            expect(screen.getByText("Tesla")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("add-modal")).not.toBeInTheDocument();
    });

    test("opens and closes EditCarModal", async () => {
        render(<Stock />);
        await waitFor(() => screen.getByText("Toyota"));

        const editButtons = screen.getAllByTitle("Edit");
        fireEvent.click(editButtons[0]);

        expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });

    test("opens and handles RemoveCarModal confirmation", async () => {
        render(<Stock />);
        await waitFor(() => screen.getByText("Toyota"));

        const deleteButtons = screen.getAllByTitle("Delete");
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByTestId("remove-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(screen.queryByText("Toyota")).not.toBeInTheDocument();
        });
    });

    test("opens and closes ViewCarModal", async () => {
        render(<Stock />);
        await waitFor(() => screen.getByText("Toyota"));

        const viewButtons = screen.getAllByTitle("View");
        fireEvent.click(viewButtons[0]);

        expect(screen.getByTestId("view-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("view-modal")).not.toBeInTheDocument();
    });
});
