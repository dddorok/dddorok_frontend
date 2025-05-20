import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import { CommonSelect } from "@/components/CommonUI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type SvgPath = string;

type PathDataType = {
  path: string;
  selectedMeasurement: string | null;
};

interface SvgMappingFormProps {
  measurementCodeList: GetMeasurementRuleItemCodeResponse[];
  onSubmit: (data: { paths: PathDataType[]; file: File | null }) => void;
}

export default function SvgMappingForm({
  measurementCodeList,
  onSubmit,
}: SvgMappingFormProps) {
  const { svgContent, paths, updateFile, file, updatePathInfo } =
    useSvgMappingPath();

  const measurementOptionList = measurementCodeList.map((measurement) => ({
    label: measurement.label,
    value: measurement.code,
  }));

  const handleSubmit = () => onSubmit({ paths, file });

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Step 2. SVG 영역과 매핑</h2>
      <UploadFileForm
        file={file}
        setFile={updateFile}
        onRemove={() => updateFile(null)}
      />

      {svgContent && paths.length === 0 && (
        <Alert variant="destructive">
          <AlertTitle>경고</AlertTitle>
          <AlertDescription>
            잘못된 SVG 파일입니다. 다시 업로드 해주세요.
          </AlertDescription>
        </Alert>
      )}

      {paths.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SvgPanel svgContent={svgContent} />
          <div className="space-y-4">
            <SelectedMeasurementList
              measurementOptionList={measurementOptionList}
              paths={paths}
            />
          </div>

          <PathSelectList
            paths={paths}
            measurementOptionList={measurementOptionList}
            updatePathInfo={updatePathInfo}
          />

          <div className="flex justify-end space-x-3 mt-10 col-span-2">
            <Button variant="outline">취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </div>
        </div>
      )}
    </div>
  );
}

const extractSvgPaths = (svgElement: HTMLElement): SvgPath[] => {
  const paths: SvgPath[] = [];

  const pathElements = svgElement.querySelectorAll("path");

  pathElements.forEach((path) => {
    const id = path.id;
    const pathData = path.getAttribute("d");
    if (id && pathData) {
      paths.push(id);
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

interface SelectedMeasurementListProps {
  measurementOptionList: { value: string; label: string }[];
  paths: PathDataType[];
}

function SelectedMeasurementList({
  measurementOptionList,
  paths,
}: SelectedMeasurementListProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base">선택된 측정항목</Label>
      <div className="grid grid-cols-2 gap-2">
        {measurementOptionList.map(({ value, label }) => {
          const checked = Boolean(
            paths.find((path) => path.selectedMeasurement === value)
              ?.selectedMeasurement
          );

          return (
            <div key={value} className="flex items-start space-x-2">
              <Checkbox id={value} checked={checked} />
              <Label htmlFor={value} className="text-sm cursor-pointer">
                {label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PathSelectListProps {
  measurementOptionList: { value: string; label: string }[];
  updatePathInfo: (pathId: string, selectedMeasurement: string | null) => void;
  paths: PathDataType[];
}

function PathSelectList({
  measurementOptionList,
  updatePathInfo,
  paths,
}: PathSelectListProps) {
  const onChange = (value: string, pathId: string) => {
    updatePathInfo(pathId, value);
  };

  return (
    <div className="space-y-2 col-span-2">
      <div className="text-sm font-medium">Path ID</div>
      <div className="grid grid-cols-2 gap-2">
        {paths.map((path) => (
          <div key={path.path} className="flex items-center space-x-2 ml-4">
            <div className={cn(`flex-1 flex flex-col gap-2`)}>
              <div>{path.path}</div>
              <CommonSelect
                options={measurementOptionList}
                onChange={(value) => onChange(value, path.path)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UploadFileFormProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onRemove: () => void;
}

export function UploadFileForm({
  file,
  setFile,
  onRemove,
}: UploadFileFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  if (file) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>파일 업로드</CardTitle>
          <CardDescription>
            업로드할 파일을 선택하고 제출 버튼을 클릭하세요.
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
            <Button onClick={onRemove}>삭제</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>파일 업로드</CardTitle>
        <CardDescription>
          업로드할 파일을 선택하고 제출 버튼을 클릭하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-semibold">클릭하여 업로드</span> 또는
                드래그 앤 드롭
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

const useSvgMappingPath = () => {
  const [svgContent, setSvgContent] = useState<string>("");
  const fileRef = useRef<File | null>(null);
  const [paths, setPaths] = useState<PathDataType[]>([]);

  const updateFile = (file: File | null) => {
    if (!file) {
      setSvgContent("");
      setPaths([]);
      fileRef.current = null;
      return;
    }

    fileRef.current = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgContent(content);

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(content, "image/svg+xml");
      const paths = extractSvgPaths(svgDoc.documentElement);

      setPaths(paths.map((path) => ({ path, selectedMeasurement: null })));
    };
    reader.readAsText(file);
  };

  const updatePathInfo = (
    pathId: string,
    selectedMeasurement: string | null
  ) => {
    setPaths((prev) => {
      return prev.map((item) => {
        if (item.path === pathId) {
          return { ...item, selectedMeasurement };
        }
        return item;
      });
    });
  };

  return {
    svgContent,
    paths,
    updateFile,
    updatePathInfo,
    file: fileRef.current,
  };
};
