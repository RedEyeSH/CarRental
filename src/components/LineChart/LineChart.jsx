import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => (
    <div style={{ height: "400px", width: "100%" }}>
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
            axisBottom={{ legend: "transportation", legendOffset: 36, legendPosition: "middle" }}
            axisLeft={{ legend: "count", legendOffset: -40, legendPosition: "middle" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
                {
                anchor: "bottom-right",
                direction: "column",
                translateX: 100,
                itemWidth: 80,
                itemHeight: 22,
                symbolShape: "circle",
                },
            ]}
            theme={{
                axis: {
                    legend: { text: { fill: "white" } },
                    ticks: { text: { fill: "white" } }
                },
                legends: {
                    text: { fill: "#4fd1c5" }
                },
                tooltip: {
                    container: {
                        color: "black",
                        fontSize: "12px"
                    }
                }
            }}
        />
    </div>
);

export default LineChart;
