"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { EditChartTypeForm } from "./edit-chart-type-client";
import { SvgUpload } from "../_components/svg-upload";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { chartTypeQueries } from "@/queries/chart-type";

export default function EditChartTypePage() {
  const { id } = useParams();

  const { data: chartType } = useQuery({
    ...chartTypeQueries.detail(id as string),
    enabled: !!id,
  });

  console.log("chartType: ", chartType);
  if (!chartType) {
    return <div>Chart type not found</div>;
  }

  return (
    <>
      <SvgUploadDialog
        measurementCodeCount={chartType.measurement_code_maps.length}
        onNext={(data) => {
          console.log("data: ", data);
          // setStep(3);
          // TODO edit
        }}
      />
      <EditChartTypeForm chartType={chartType} />
    </>
  );
}

function SvgUploadDialog({
  measurementCodeCount,
  onNext,
}: {
  measurementCodeCount: number;
  onNext: (data: {
    pathIds: string[];
    file: File | null;
    svgContent: string;
  }) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">SVG 재 업로드</Button>
      </DialogTrigger>
      <DialogContent>
        <SvgUpload
          onSubmit={(data) => {
            console.log("data: ", data);
            if (data.pathIds.length > measurementCodeCount) {
              toast({
                variant: "destructive",
                title:
                  "Path 개수가 측정항목 개수보다 많습니다. 다시 확인해주세요.",
                description: `Path 개수: ${data.pathIds.length}, 측정항목 개수: ${measurementCodeCount}`,
              });
              return;
            }
            onNext(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
