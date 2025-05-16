import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

import { CommonSelect } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

export default function SvgMappingForm({
  measurementCodeList,
  onSubmit,
}: {
  measurementCodeList: GetMeasurementRuleItemCodeResponse[];
  onSubmit: (data: any) => void;
}) {
  const [svgPath, setSvgPath] = useState<HTMLElement | null>(null);
  const fileRef = useRef<File | null>(null);

  const [selectedPath, setSelectedPath] = useState("");
  const [pathList, setPathList] = useState<SvgPath[]>([]);

  const [paths, setPaths] = useState<
    {
      path: SvgPath;
      selectedMeasurement: string | null;
    }[]
  >([]);
  console.log("paths: ", paths);

  const handleSubmit = () => {
    onSubmit({
      paths,
      file: fileRef.current,
    });
  };

  const measurementOptionList = measurementCodeList.map((measurement) => ({
    label: measurement.label,
    value: measurement.code,
  }));

  const onUpload = () => {
    // SVG 파일 업로드 처리
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".svg";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      fileRef.current = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

        // SVG 요소를 찾아서 현재 SVG를 대체
        const svgContainer = document.querySelector(".w-full.h-full.relative");
        if (svgContainer) {
          const newSvg = svgDoc.documentElement;

          const paths = extractSvgPaths(newSvg);

          setPathList(paths);
          setPaths(
            paths.map((path) => ({ path: path, selectedMeasurement: null }))
          );
          setSvgPath(newSvg);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Step 2. SVG 영역과 매핑</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽 SVG 미리보기 패널 */}
        <div className="space-y-4">
          <Card className="p-4 border flex items-center justify-center h-fit">
            <div className="w-full h-full relative">
              <div className="text-lg font-medium mb-4">미리보기 패널</div>

              {!svgPath && (
                <div className="text-center text-gray-500">
                  파일을 업로드 해주세요
                </div>
              )}
              {/* SVG 미리보기 */}
              {svgPath && (
                <div dangerouslySetInnerHTML={{ __html: svgPath.outerHTML }} />
              )}
            </div>
          </Card>

          {/* 파일 업로드 버튼 */}
          <div>
            <Button variant="outline" className="w-full" onClick={onUpload}>
              파일 업로드 영역 (알파벳 .svg)
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-base">선택된 측정항목</Label>
            <div className="grid grid-cols-2 gap-2">
              {measurementOptionList.map(({ value, label }) => {
                const checked = Boolean(
                  paths.find((path) => path.selectedMeasurement === value)
                    ?.selectedMeasurement
                );

                console.log("checked: ", checked);
                return (
                  <div key={value} className="flex items-start space-x-2">
                    <Checkbox id={value} checked={checked} />
                    <Label htmlFor={value} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                    {/* {key === "앞품길이" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ← 선택 불가 (이대로 놔두세요)
                      </span>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Path ID</div>
            {pathList.map((path) => (
              <div key={path.id} className="flex items-center space-x-2 ml-4">
                <div
                  className={cn(
                    `flex-1 flex flex-col gap-2`,
                    selectedPath === path.id ? "font-medium" : ""
                  )}
                  onClick={() => setSelectedPath(path.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div>{path.id}</div>
                  <CommonSelect
                    options={measurementOptionList}
                    onChange={(value) => {
                      setPaths((prev) => {
                        return prev.map((item) => {
                          if (item.path.id === path.id) {
                            return { ...item, selectedMeasurement: value };
                          }
                          return item;
                        });
                      });
                      console.log("value: ", value);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-10">
            <Button variant="outline">취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SvgPath {
  id: string;
  path: string;
  stroke?: string;
  strokeLinecap?: string;
}

const extractSvgPaths = (svgElement: HTMLElement): SvgPath[] => {
  const paths: SvgPath[] = [];

  const pathElements = svgElement.querySelectorAll("path");

  pathElements.forEach((path) => {
    const id = path.id;
    const pathData = path.getAttribute("d");
    const stroke = path.getAttribute("stroke");
    const strokeLinecap = path.getAttribute("stroke-linecap");

    if (id && pathData) {
      paths.push({
        id,
        path: pathData,
        stroke: stroke || undefined,
        strokeLinecap: strokeLinecap || undefined,
      });
    }
  });

  return paths;
};

const useItemCodeList = (measurementRuleId: string) => {
  const {
    data: { items: measurementRuleList },
  } = useSuspenseQuery(
    measurementRuleQueries.getMeasurementRuleByIdQueryOptions(measurementRuleId)
  );
  // console.log("measurementRuleList: ", measurementRuleList);

  // const { data: measurementRuleItemCodeList } = useSuspenseQuery(
  //   measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions()
  // );
  // console.log("measurementRuleItemCodeList: ", measurementRuleItemCodeList);
};
