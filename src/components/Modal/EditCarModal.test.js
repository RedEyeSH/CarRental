import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditCarModal from "./EditCarModal";

global.URL.createObjectURL = jest.fn(() => "mocked-image-url");
global.alert = jest.fn();

beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
});

const carData = {
    id: 1,
    brand: "Tesla",
    model: "Model S",
    year: 2022,
    type: "Sedan",
    license_plate: "ABC123",
    status: "AVAILABLE",
    price_per_day: 100,
    imageUrl: "existing-image.jpg",
};

const onClose = jest.fn();
const onUpdate = jest.fn();

describe("EditCarModal", () => {
    beforeEach(() => {
        render(<EditCarModal carData={carData} onClose={onClose} onUpdate={onUpdate} />);
    });

    test("renders form with prefilled carData", () => {
        expect(screen.getByDisplayValue(carData.brand)).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.model)).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.year.toString())).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.type)).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.license_plate)).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.status)).toBeInTheDocument();
        expect(screen.getByDisplayValue(carData.price_per_day.toString())).toBeInTheDocument();
        expect(screen.getByAltText("Car Preview")).toHaveAttribute("src", carData.imageUrl);
    });

    test("input changes update formData", () => {
        const brandInput = screen.getByDisplayValue("Tesla");
        fireEvent.change(brandInput, { target: { value: "Audi" } });
        expect(brandInput.value).toBe("Audi");

        const statusSelect = screen.getByDisplayValue("AVAILABLE");
        fireEvent.change(statusSelect, { target: { value: "RENTED" } });
        expect(statusSelect.value).toBe("RENTED");
    });

    test("file input updates preview", () => {
        const { container } = render(<EditCarModal carData={carData} onClose={onClose} onUpdate={onUpdate} />);
        const fileInput = container.querySelector('input[name="image"]');
        const file = new File(["dummy"], "test.png", { type: "image/png" });

        fireEvent.change(fileInput, { target: { files: [file] } });

        const images = screen.getAllByAltText("Car Preview");
        const updatedPreview = images[images.length - 1];

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(updatedPreview).toHaveAttribute("src", "mocked-image-url");
    });

    test("clicking image preview opens fullscreen modal", () => {
        const previewDiv = screen.getByAltText("Car Preview").parentElement;
        fireEvent.click(previewDiv);

        expect(screen.getByAltText("Fullscreen Preview")).toBeInTheDocument();

        // close fullscreen modal
        const overlay = screen.getByAltText("Fullscreen Preview").parentElement;
        fireEvent.click(overlay);
        expect(screen.queryByAltText("Fullscreen Preview")).not.toBeInTheDocument();
    });

    test("clicking Cancel calls onClose", () => {
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(onClose).toHaveBeenCalled();
    });

    test("submitting form calls fetch and triggers onUpdate and onClose", async () => {
        global.fetch.mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getByText(/Save Changes/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:3000/api/v1/cars/${carData.id}`,
                expect.objectContaining({
                    method: "PUT",
                    body: expect.any(FormData),
                })
            );
            expect(onUpdate).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
            expect(global.alert).toHaveBeenCalledWith("Car updated successfully!");
        });
    });

    test("handles fetch failure and shows alert", async () => {
        global.fetch.mockResolvedValueOnce({ ok: false });

        fireEvent.click(screen.getByText(/Save Changes/i));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Error updating car");
        });
    });
});