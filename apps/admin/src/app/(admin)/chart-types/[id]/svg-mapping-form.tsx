/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import { SvgUpload } from "../_components/svg-upload";
import {
  SelectMeasurementList,
  SelectPathList,
} from "../_components/SvgMappingForm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface PathType {
  pathId: string;
  selectedMeasurement: string | null;
}

interface SvgMappingFormProps {
  measurementCodeList: {
    label: string;
    value: string;
  }[];
  onSubmit: (data: { paths: PathType[] }) => void;
  svgFileUrl: string;
  measurementCodeMaps: {
    measurement_code: string;
    path_id: string;
  }[];
}

export default function SvgMappingForm(props: SvgMappingFormProps) {
  const [paths, setPaths] = useState<PathType[]>(
    props.measurementCodeMaps.map((item) => ({
      pathId: item.path_id,
      selectedMeasurement: item.measurement_code,
    }))
  );

  const handleSubmit = () => {
    props.onSubmit({ paths });
  };

  const updateMeasurementCode = (
    pathId: string,
    selectedMeasurement: string
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

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4 border flex items-center justify-center h-fit">
            <div className="w-full h-full relative">
              <div className="text-lg font-medium mb-4">미리보기 패널</div>
              <img src={props.svgFileUrl} alt="svg" />
            </div>
          </Card>

          <SelectMeasurementList
            list={props.measurementCodeList.map(({ value, label }) => ({
              value,
              label,
              selected: Boolean(
                paths.find((path) => path.selectedMeasurement === value)
              ),
            }))}
          />
        </div>

        <div className="space-y-6">
          <SelectPathList
            paths={paths}
            options={props.measurementCodeList}
            updateMeasurementCode={updateMeasurementCode}
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
