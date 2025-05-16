import { useSuspenseQuery } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";

import { CommonSelect } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

interface SvgPath {
  id: string;
  path: string;
  stroke?: string;
  strokeLinecap?: string;
}

export default function SvgMappingForm({
  measurementCodeList,
  onSubmit,
}: {
  measurementCodeList: GetMeasurementRuleItemCodeResponse[];
  onSubmit: (data: any) => void;
}) {
  const [svgContent, setSvgContent] = useState<string>("");
  const fileRef = useRef<File | null>(null);
  const [pathList, setPathList] = useState<SvgPath[]>([]);
  const [paths, setPaths] = useState<
    { path: SvgPath; selectedMeasurement: string | null }[]
  >([]);

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

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    fileRef.current = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgContent(content);

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(content, "image/svg+xml");
      const paths = extractSvgPaths(svgDoc.documentElement);

      setPathList(paths);
      setPaths(
        paths.map((path) => ({ path: path, selectedMeasurement: null }))
      );
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Step 2. SVG 영역과 매핑</h2>

      <UploadFileForm file={fileRef.current} setFile={handleFileChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SvgPanel svgContent={svgContent} />
        <div className="space-y-4">
          <SelectedMeasurementList
            measurementOptionList={measurementOptionList}
            paths={paths}
          />
        </div>

        <div className="space-y-6">
          <PathSelectList
            pathList={pathList}
            measurementOptionList={measurementOptionList}
            setPaths={setPaths}
          />

          <div className="flex justify-end space-x-3 mt-10">
            <Button variant="outline">취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
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

function SvgPanel({ svgContent }: { svgContent: string }) {
  return (
    <Card className="p-4 border flex items-center justify-center h-fit">
      <div className="w-full h-full relative">
        <div className="text-lg font-medium mb-4">미리보기 패널</div>

        {!svgContent && (
          <div className="text-center text-gray-500">
            파일을 업로드 해주세요
          </div>
        )}
        {svgContent && <div dangerouslySetInnerHTML={{ __html: svgContent }} />}
      </div>
    </Card>
  );
}

function SelectedMeasurementList({
  measurementOptionList,
  paths,
}: {
  measurementOptionList: { value: string; label: string }[];
  paths: { path: SvgPath; selectedMeasurement: string | null }[];
}) {
  return (
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
  );
}

function PathSelectList({
  measurementOptionList,
  setPaths,
  pathList,
}: {
  measurementOptionList: { value: string; label: string }[];
  setPaths: Dispatch<
    SetStateAction<{ path: SvgPath; selectedMeasurement: string | null }[]>
  >;
  pathList: SvgPath[];
}) {
  const onChange = (value: string, pathId: string) => {
    setPaths((prev) => {
      return prev.map((item) => {
        if (item.path.id === pathId) {
          return { ...item, selectedMeasurement: value };
        }
        return item;
      });
    });
  };
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Path ID</div>
      {pathList.map((path) => (
        <div key={path.id} className="flex items-center space-x-2 ml-4">
          <div className={cn(`flex-1 flex flex-col gap-2`)}>
            <div>{path.id}</div>
            <CommonSelect
              options={measurementOptionList}
              onChange={(value) => onChange(value, path.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UploadFileForm({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  if (file) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload a File</CardTitle>
          <CardDescription>
            Select a file to upload and click the submit button.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button onClick={() => setFile(null)}>Remove</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a File</CardTitle>
        <CardDescription>
          Select a file to upload and click the submit button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
