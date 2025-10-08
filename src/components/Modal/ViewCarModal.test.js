import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ViewCarModal from "./ViewCarModal";

beforeAll(() => {
    global.fetch = jest.fn(); // create a global fetch mock
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("ViewCarModal", () => {
    const mockCar = {
        id: 100,
        brand: "Fiat",
        model: "500",
        year: "2020",
        type: "Hatchback",
        license_plate: "HEL-1",
        status: "AVAILABLE",
        price_per_day: 50,
        image: "fiat.jpg",
    };

    const mockFeedbacks = [
        { rating: 5, comment: "Great car!", created_at: "2025-11-01T12:00:00Z" },
        { rating: 4, comment: "Smooth ride", created_at: "2025-11-02T10:30:00Z" },
    ];

    beforeEach(() => {
        jest.restoreAllMocks();
        localStorage.setItem("token", "mock-token");
    });

    test("renders nothing if isOpen is false", () => {
        render(<ViewCarModal isOpen={false} carId={100} />);
        expect(screen.queryByText(/Car Details/i)).toBeNull();
    });

    test("renders loading state initially", () => {
        jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));
        render(<ViewCarModal isOpen={true} carId={100} />);
        expect(screen.getByText(/Car Details/i)).toBeInTheDocument(); // title present
    });

    test("renders car details and feedback correctly", async () => {
        // Mock car fetch
        jest.spyOn(global, "fetch")
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(mockCar) })
            )
            // Mock feedback fetch
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(mockFeedbacks) })
            );

        render(<ViewCarModal isOpen={true} carId={100} />);

        // Wait for car details to load
        await waitFor(() => {
            // Brand and model
            expect(screen.getByText("Fiat 500")).toBeInTheDocument();
            expect(screen.getByText("2020")).toBeInTheDocument();

            // Car details
            expect(screen.getByText("Type:").parentElement).toHaveTextContent("Hatchback");
            expect(screen.getByText("License Plate:").parentElement).toHaveTextContent("HEL-1");
            expect(screen.getByText("Status:").parentElement).toHaveTextContent("AVAILABLE");
            expect(screen.getByText("Price/Day:").parentElement).toHaveTextContent("50 €");

            // Feedback
            expect(screen.getByText("4.5 / 5")).toBeInTheDocument();
            expect(screen.getByText("Great car!")).toBeInTheDocument();
            expect(screen.getByText("Smooth ride")).toBeInTheDocument();

            // Car image
            const img = screen.getByAltText("Car");
            expect(img).toBeInTheDocument();
            expect(img.src).toContain("fiat.jpg");
        });
    });

    test("displays 'No ratings yet' if there is no feedback", async () => {
        jest.spyOn(global, "fetch")
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(mockCar) })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
            );

        render(<ViewCarModal isOpen={true} carId={100} />);

        await waitFor(() => {
            expect(screen.getByText(/No ratings yet/)).toBeInTheDocument();
            expect(screen.getByText(/No feedback for this car yet/)).toBeInTheDocument();
        });
    });

    test("displays error if car fetch fails", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.reject(new Error("Fetch failed"))
        );

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<ViewCarModal isOpen={true} carId={100} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Feedback fetch error:",
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });


    test("calls onClose when Close button is clicked", async () => {
        jest.spyOn(global, "fetch")
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(mockCar) })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(mockFeedbacks) })
            );

        const handleClose = jest.fn();
        render(<ViewCarModal isOpen={true} carId={100} onClose={handleClose} />);

        await waitFor(() => screen.getByText(/Fiat 500/));

        fireEvent.click(screen.getByText(/Close/));
        expect(handleClose).toHaveBeenCalled();
    });
});
