"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { projectQueries } from "@/queries/project";
import { createProject } from "@/services/project";

const DUMMY = {
  name: "여름 민소매 베스트",
  template_id: "7a3345f6-1243-4de6-88c4-9012f41715b0",
  gauge_ko: 22,
  gauge_dan: 30,
  measurement_codes: [
    {
      measurement_code: "BODY_BACK_NECK_WIDTH",
      value: 15,
    },
    {
      measurement_code: "BODY_SHOULDER_WIDTH",
      value: 21,
    },
    {
      measurement_code: "SLEEVE_TOTAL_WIDTH",
      value: 12,
    },
    {
      measurement_code: "SLEEVE_HEM_WIDTH",
      value: 6,
    },
    {
      measurement_code: "BODY_CHEST_WIDTH",
      value: 32,
    },
    {
      measurement_code: "BODY_HEM_WIDTH",
      value: 32,
    },
    {
      measurement_code: "BODY_BACK_NECK_LENGTH",
      value: 1.2,
    },
    {
      measurement_code: "BODY_SHOULDER_SLOPE_LENGTH",
      value: 1,
    },
    {
      measurement_code: "BODY_FRONT_NECK_LENGTH",
      value: 5.5,
    },
    {
      measurement_code: "BODY_ARMHOLE_LENGTH",
      value: 13,
    },
    {
      measurement_code: "BODY_WAIST_LENGTH",
      value: 24,
    },
    {
      measurement_code: "SLEEVE_LOWER_SLEEVE_LENGTH",
      value: 18,
    },
  ],
};
export default function TestPage() {
  const action = async () => {
    const response = await createProject(DUMMY);
    console.log(response);
    alert("프로젝트 생성 완료");
  };

  const { data: myProjectList } = useQuery({
    ...projectQueries.myProjectList(),
  });
  console.log("myProjectList: ", myProjectList);
  return (
    <div className="flex flex-col p-4 gap-4">
      <Button onClick={action}>create</Button>

      <h2>내 프로젝트 리스트</h2>
      {myProjectList?.data.map((project) => (
        <Link href={`/project/test/${project.id}`} key={project.id}>
          <div className="flex flex-col gap-2 border p-1">
            <div>{project.name}</div>
            <div>{project.created_date}</div>
            <div>{project.updated_date}</div>
            <div className="flex flex-col gap-2">
              {project.chart_list.map((chart) => (
                <div key={chart.chart_id}>{chart.name}</div>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
