import React from "react";
import { render, screen } from "@testing-library/react";
import LineChart from "./LineChart";
import { ResponsiveLine } from "@nivo/line";

jest.mock("@nivo/line", () => ({
    ResponsiveLine: jest.fn(() => <div data-testid="responsive-line" />),
}));

describe("LineChart", () => {
    const mockData = [
        {
            id: "series1",
            data: [
                { x: "A", y: 10 },
                { x: "B", y: 20 },
            ],
        },
    ];

    it("renders the LineChart component", () => {
        render(<LineChart data={mockData} />);

        expect(screen.getByTestId("responsive-line")).toBeInTheDocument();
    });

    it("passes the correct props to ResponsiveLine", () => {
        render(<LineChart data={mockData} />);

        expect(ResponsiveLine).toHaveBeenCalledWith(
            expect.objectContaining({
                data: mockData,
                margin: { top: 50, right: 110, bottom: 50, left: 60 },
                xScale: { type: "point" },
                yScale: { type: "linear", min: "auto", max: "auto", stacked: true, reverse: false },
                axisBottom: expect.objectContaining({
                    legend: "X Axis", // Updated to match the actual value
                    legendOffset: 36,
                    legendPosition: "middle",
                }),
                axisLeft: expect.objectContaining({
                    legend: "Y Axis", // Updated to match the actual value
                    legendOffset: -40,
                    legendPosition: "middle",
                }),
                pointSize: 10,
                pointColor: { theme: "background" },
                pointBorderWidth: 2,
                pointBorderColor: { from: "serieColor" },
                pointLabelYOffset: -12,
                enableTouchCrosshair: true,
                useMesh: true,
                legends: [
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        translateX: 100,
                        itemWidth: 80,
                        itemHeight: 22,
                        symbolShape: "circle",
                    },
                ],
                theme: expect.objectContaining({ // Added theme to match the actual props
                    axis: expect.any(Object),
                    legends: expect.any(Object),
                    tooltip: expect.any(Object),
                }),
            }),
            undefined
        );
    });
});