import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import {
  SelectMeasurementList,
  SelectPathList,
} from "../_components/SvgMappingForm";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

type SvgPath = string;

type PathDataType = {
  pathId: string;
  selectedMeasurement: string | null;
};

interface SvgMappingFormProps {
  measurementCodeList: GetMeasurementRuleItemCodeResponse[];
  onSubmit: (data: {
    paths: { pathId: string; selectedMeasurement: string }[];
    file: File | null;
  }) => void;
  pathData: {
    pathIds: string[];
    file: File | null;
    svgContent: string;
  };
}

export default function SvgMappingForm({
  measurementCodeList,
  onSubmit,
  pathData,
}: SvgMappingFormProps) {
  const { file, svgContent } = pathData;
  const { paths, updatePathInfo } = useSvgMappingPath(pathData);

  const measurementOptionList = measurementCodeList.map((measurement) => ({
    label: measurement.label,
    value: measurement.code,
  }));

  const handleSubmit = () => {
    const setMeasurementList = new Set(
      paths.map((path) => path.selectedMeasurement)
    );

    if (paths.some((path) => !path.selectedMeasurement)) {
      toast({
        title: "경고",
        variant: "destructive",
        description: "모든 경로에 측정항목을 선택해주세요.",
      });
      return;
    }

    if (setMeasurementList.size !== paths.length) {
      toast({
        variant: "destructive",
        title: "경고",
        description: "중복된 측정항목이 있습니다.",
      });
      return;
    }

    onSubmit({
      // TODO: 더 안정성 있는 방식으로
      paths: paths.map((path) => ({
        pathId: path.pathId,
        selectedMeasurement: path.selectedMeasurement ?? "",
      })),
      file,
    });
  };
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {paths.length === 0 && (
        <div className="text-center text-gray-500">Error</div>
      )}
      {paths.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SvgPanel svgContent={svgContent} />
          <div className="space-y-4">
            <SelectMeasurementList
              list={measurementOptionList.map((measurement) => ({
                label: measurement.label,
                value: measurement.value,
                selected: paths.some(
                  (path) => path.selectedMeasurement === measurement.value
                ),
              }))}
            />
          </div>

          <SelectPathList
            paths={paths.map((path) => ({
              pathId: path.pathId,
              selectedMeasurement: path.selectedMeasurement,
            }))}
            options={measurementOptionList}
            updateMeasurementCode={updatePathInfo}
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

function SvgPanel({ svgContent }: { svgContent: string }) {
  return (
    <Card className="p-4 border flex items-center justify-center h-fit">
      <div className="w-full h-full relative">
        <div className="text-lg font-medium mb-4">미리보기 패널</div>
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    </Card>
  );
}

const useSvgMappingPath = (pathData: {
  pathIds: string[];
  file: File | null;
  svgContent: string;
}) => {
  const [paths, setPaths] = useState<PathDataType[]>(
    pathData.pathIds.map((pathId) => ({
      pathId,
      selectedMeasurement: null,
    }))
  );

  const updatePathInfo = (
    pathId: string,
    selectedMeasurement: string | null
  ) => {
    setPaths((prev) => {
      return prev.map((item) => {
        if (item.pathId === pathId) {
          return { ...item, selectedMeasurement };
        }
        return item;
      });
    });
  };

  return {
    paths,
    updatePathInfo,
  };
};
