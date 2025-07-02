"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import ChartEdit from "./ChartEdit";

import { cn } from "@/lib/utils";
import { projectQueries } from "@/queries/project";

export function ProjectEditClient({ id }: { id: string }) {
  const { data: project } = useQuery({
    ...projectQueries.project(id),
  });

  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  useEffect(() => {
    if (project?.chart_list.length) {
      const firstChart = project.chart_list[0];
      if (firstChart) {
        setSelectedChart(firstChart.chart_id);
      }
    }
  }, [project]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-[100px] flex items-center justify-between">
        <div className="container">
          <div className="text-neutral-800 text-[24px] font-bold">
            {project.name}
          </div>
        </div>
        <div></div>
      </div>
      <div className="bg-neutral-N200 min-h-[calc(100vh-100px)]">
        <div className="container">
          <div className="flex gap-2 py-6">
            {project.chart_list.map((chart) => (
              <button
                key={chart.chart_id}
                onClick={() => setSelectedChart(chart.chart_id)}
                className={cn(
                  "rounded-2xl bg-neutral-N0 border border-neutral-N300 text-neutral-600 text-[14px] font-medium",
                  "py-3 px-4 flex gap-2 items-center",
                  selectedChart === chart.chart_id &&
                    "border-primary-PR text-neutral-1000"
                )}
              >
                {selectedChart === chart.chart_id && <CheckmarkIcon />}
                {chart.name}
              </button>
            ))}
          </div>
          {selectedChart && <Chart key={selectedChart} id={selectedChart} />}
        </div>
      </div>
    </>
  );
}

function Chart({ id }: { id: string }) {
  const { data: chart } = useQuery({
    ...projectQueries.chart(id),
  });

  if (!chart) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={cn(
        "w-[1204px] bg-neutral-N0 shadow-[0px_2px_20px_rgba(28,31,37,0.2)]",
        "p-8 min-h-fit overflow-auto"
      )}
    >
      <ChartEdit
        grid_row={chart.grid_row}
        grid_col={chart.grid_col}
        cells={chart.cells}
      />
    </div>
  );
}

function CheckmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0892 3.68114C12.3113 3.91448 12.3022 4.28372 12.0689 4.50584L5.32813 10.9225C5.21302 11.0321 5.05818 11.09 4.89941 11.0827C4.74065 11.0755 4.59171 11.0038 4.48702 10.8842L1.89443 7.92269C1.68222 7.68029 1.7067 7.31176 1.94911 7.09955C2.19151 6.88735 2.56005 6.91183 2.77225 7.15423L4.96425 9.65816L11.2645 3.66082C11.4978 3.4387 11.8671 3.44779 12.0892 3.68114Z"
        fill="#75C0EF"
      />
    </svg>
  );
}
