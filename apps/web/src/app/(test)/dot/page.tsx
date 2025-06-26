"use client";

import { useQuery } from "@tanstack/react-query";

import ChartEdit from "./ChartEdit";
import chartDummyData from "./generated_chart.json";
// import KnittingPatternEditor from "./knitting";

import PixelArtEditor from "./pixel-art-editor-demo";

import { projectQueries } from "@/queries/project";

export default function DotPage() {
  // const { data: chart } = useQuery({
  //   ...projectQueries.chart("9c326ee7-1b8c-44fa-8eee-2c653f346af2"),
  // });

  const chart = chartDummyData.data.chart_parts[0];

  const chartShapeObj = chart?.cells.reduce(
    (acc, cell) => {
      acc[cell.symbol] = (acc[cell.symbol] || 0) + 1;
      // acc[cell.id] = cell;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("chartShapeObj: ", chartShapeObj);

  if (!chart) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ChartEdit chart={chart} />
    </>
  );
}
