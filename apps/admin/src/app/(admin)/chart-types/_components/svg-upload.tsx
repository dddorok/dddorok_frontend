import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import { FileUploadForm } from "@/components/FileUploadForm";
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
      <Card>
        <CardHeader>
          <CardTitle>파일 업로드</CardTitle>
          <CardDescription>
            업로드할 파일을 선택하고 다음 버튼을 클릭하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadForm
            file={file}
            setFile={updateFile}
            onRemove={() => updateFile(null)}
            type="file"
          />
        </CardContent>
      </Card>

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
