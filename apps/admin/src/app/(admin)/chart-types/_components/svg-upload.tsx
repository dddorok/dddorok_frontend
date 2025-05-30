import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SvgPath = string;

type PathDataType = {
  pathId: string;
};

interface SvgMappingFormProps {
  onSubmit: (data: {
    pathIds: string[];
    file: File | null;
    svgContent: string;
  }) => void;
}

export function SvgUpload({ onSubmit }: SvgMappingFormProps) {
  const { svgContent, paths, updateFile, file } = useSvgMappingPath();

  const isError = Boolean(!file || (svgContent && paths.length === 0));

  const handleSubmit = () =>
    onSubmit({
      pathIds: paths.map((path) => path.pathId),
      file,
      svgContent,
    });

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <UploadFileForm
        file={file}
        setFile={updateFile}
        onRemove={() => updateFile(null)}
      />

      {file && isError && (
        <Alert variant="destructive">
          <AlertTitle>경고</AlertTitle>
          <AlertDescription>
            잘못된 SVG 파일입니다. 다시 업로드 해주세요.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isError}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </Button>
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
    if (id && pathData) {
      paths.push(id);
    }
  });

  return paths;
};

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
            업로드할 파일을 선택하고 다음 버튼을 클릭하세요.
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
          업로드할 파일을 선택하고 다음 버튼을 클릭하세요.
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

      setPaths(
        paths.map((path) => ({ pathId: path, selectedMeasurement: null }))
      );
    };
    reader.readAsText(file);
  };

  // const updatePathInfo = (
  //   pathId: string,
  //   selectedMeasurement: string | null
  // ) => {
  //   setPaths((prev) => {
  //     return prev.map((item) => {
  //       if (item.pathId === pathId) {
  //         return { ...item, selectedMeasurement };
  //       }
  //       return item;
  //     });
  //   });
  // };

  return {
    svgContent,
    paths,
    updateFile,
    file: fileRef.current,
  };
};
