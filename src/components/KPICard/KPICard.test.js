import React from "react";
import { render, screen } from "@testing-library/react";
import KPICard from "./KPICard";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation function
    }),
}));

describe("KPICard Component", () => {
    test("renders the KPICard component with correct props", () => {
        render(
            <KPICard
                icon={faArrowUp}
                label="Revenue"
                value={5000}
                change="+10%"
                color="green"
            />
        );

        expect(screen.getByText("Revenue")).toBeInTheDocument();

        expect(screen.getByText("+10%")).toBeInTheDocument();
    });

    test("applies the correct color style", () => {
        const { container } = render(
            <KPICard
                icon={faArrowUp}
                label="Revenue"
                value={5000}
                change="+10%"
                color="green"
            />
        );

        const iconElement = container.querySelector(".kpi-card-icon");
        const changeElement = container.querySelector(".kpi-card-change");

        expect(iconElement).toHaveStyle("color: rgb(0, 128, 0)");
        expect(changeElement).toHaveStyle("color: rgb(0, 128, 0)");
    });

    test("renders the FontAwesome icon", () => {
        const { container } = render(
            <KPICard
                icon={faArrowUp}
                label="Revenue"
                value={5000}
                change="+10%"
                color="green"
            />
        );

        const iconElement = container.querySelector(".svg-inline--fa.fa-arrow-up");
        expect(iconElement).toBeInTheDocument();
    });
});