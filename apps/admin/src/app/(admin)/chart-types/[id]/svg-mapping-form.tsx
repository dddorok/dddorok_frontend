import React, { useState } from "react";

import { CommonSelect } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SvgMappingForm({
  measurementCodeList,
  onSubmit,
  svgFileUrl,
  measurementCodeMaps,
}: {
  measurementCodeList: {
    label: string;
    value: string;
  }[];
  onSubmit: (data: {
    paths: { pathId: string; selectedMeasurement: string }[];
  }) => void;
  svgFileUrl: string;
  measurementCodeMaps: {
    measurement_code: string;
    path_id: string;
  }[];
}) {
  const [paths, setPaths] = useState<
    {
      pathId: string;
      selectedMeasurement: string | null;
    }[]
  >(
    measurementCodeMaps.map((item) => ({
      pathId: item.path_id,
      selectedMeasurement: item.measurement_code,
    }))
  );
  console.log("paths: ", paths);

  const handleSubmit = () => {
    onSubmit({
      paths: paths.map(({ pathId, selectedMeasurement }) => ({
        pathId,
        selectedMeasurement: selectedMeasurement ?? "",
      })),
    });
  };

  const measurementOptionList = measurementCodeList;

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽 SVG 미리보기 패널 */}
        <div className="space-y-4">
          <Card className="p-4 border flex items-center justify-center h-fit">
            <div className="w-full h-full relative">
              <div className="text-lg font-medium mb-4">미리보기 패널</div>

              <img src={svgFileUrl} alt="svg" />
            </div>
          </Card>

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
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Path ID</div>
            {paths.map(({ pathId }) => (
              <div key={pathId} className="flex items-center space-x-2 ml-4">
                <div className={cn(`flex-1 flex flex-col gap-2`)}>
                  <div>{pathId}</div>
                  <CommonSelect
                    value={
                      paths.find((item) => item.pathId === pathId)
                        ?.selectedMeasurement ?? ""
                    }
                    options={measurementOptionList}
                    onChange={(value) => {
                      setPaths((prev) => {
                        return prev.map((item) => {
                          if (item.pathId === pathId) {
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
