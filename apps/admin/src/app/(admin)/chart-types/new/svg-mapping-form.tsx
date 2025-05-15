import { AlertCircle } from "lucide-react";
import React, { useState } from "react";

import { CommonSelect } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function SvgMappingForm() {
  const [selectedMeasurements, setSelectedMeasurements] = useState({
    앞품길이: true,
    어깨끝점거리: true,
    어깨사선길이: true,
    진동길이: false,
    허리길이: false,
  });
  const [svgPath, setSvgPath] = useState<HTMLElement | null>(null);

  const [selectedPath, setSelectedPath] = useState("");
  const [pathList, setPathList] = useState<SvgPath[]>([]);

  const [paths, setPaths] = useState<
    {
      path: SvgPath;
      selectItem: string | null;
    }[]
  >([]);

  const toggleMeasurement = (key: string) => {
    setSelectedMeasurements((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof selectedMeasurements],
    }));
  };

  const onUpload = () => {
    // SVG 파일 업로드 처리
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".svg";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

        // SVG 요소를 찾아서 현재 SVG를 대체
        const svgContainer = document.querySelector(".w-full.h-full.relative");
        if (svgContainer) {
          const newSvg = svgDoc.documentElement;
          console.log("newSvg: ", newSvg);

          const paths = extractSvgPaths(newSvg);

          setPathList(paths);
          setPaths(paths.map((path) => ({ path: path, selectItem: null })));
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
            <div className="w-full h-full relative pt-10">
              <div className="text-lg font-medium absolute top-2 left-4">
                미리보기 패널
              </div>

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

          {/* Path ID 리스트 */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Path ID</div>
            {pathList.map((path) => (
              <div key={path.id} className="flex items-center space-x-2 ml-4">
                <div
                  className={`flex-1 flex flex-col gap-2 ${selectedPath === path.id ? "font-medium" : ""}`}
                  onClick={() => setSelectedPath(path.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div>{path.id}</div>
                  <CommonSelect
                    options={[
                      { label: "test", value: "test" },
                      { label: "test2", value: "test2" },
                      { label: "test3", value: "test3" },
                    ]}
                    onChange={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 측정항목 패널 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">측정항목</Label>
            <div className="space-y-2">
              {Object.entries(selectedMeasurements).map(([key, checked]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={() => toggleMeasurement(key)}
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {key}
                  </Label>
                  {key === "앞품길이" && (
                    <span className="text-xs text-gray-500 ml-2">
                      ← 선택 불가 (이대로 놔두세요)
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500 mt-4">
              필터타입, 디자인 유형... 바뀌는
              <br />
              파라미터
            </div>
          </div>

          {/* 측정 항목 선택 리스트 */}
          <div className="space-y-3 mt-6">
            <Input value="앞품길이" readOnly className="bg-gray-100" />
            <Input value="어깨끝점거리" readOnly className="bg-gray-100" />
            <Input value="어깨사선길이" readOnly className="bg-gray-100" />

            {/* 경고 메시지가 포함된 입력 필드 */}
            <div className="relative">
              <Input
                value="어깨사선 잘못 측정됨"
                readOnly
                className="pr-10 border-red-500 bg-red-50 text-red-600"
              />
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            </div>

            {/* <div className="text-sm text-gray-500 text-center mt-2">
              <span className="block">↑</span>
              <span>매핑시 잘못 측정 원인가 제일 안안하게할</span>
            </div> */}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3 mt-10">
            <Button variant="outline">취소</Button>
            <Button>저장</Button>
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

  // SVG 내의 모든 path 요소를 찾습니다
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
