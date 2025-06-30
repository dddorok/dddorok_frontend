"use client";

import { getPathDefs } from "@dddorok/utils/chart/svg-path";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { AutoMappingTable } from "./_components/AutoMappingTable";
import { ManualMappingTable } from "./_components/ManualMappingTable";
import { SvgPreview } from "./_components/SvgPreview";
import { useSvgContent } from "./hooks/useSvgContent";
import { SliderControlModal, SliderControlRowType } from "./SliderControlModal";
import { previewH, previewW } from "./utils/etc";

import { DownloadButton } from "@/components/DownloadButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast, useToast } from "@/hooks/use-toast";
import { getChartType } from "@/services/chart-type";
import { updateChartTypeSvgMapping } from "@/services/chart-type/new";

export interface MeasurementItem {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  adjustable: boolean;
  isMultiPath: boolean;
  baseLength?: number;
  pathIds?: string[];
}

const ChartRegistration: React.FC<{
  data: {
    svg_url: string;
    svg_name: string;
    mapped_path_id: {
      code: string;
      label: string;
      slider_default: boolean;
    }[];
    manual_mapped_path_id: {
      code: string;
      label: string;
      slider_default: boolean;
    }[];
  };
  id: string;
}> = ({ data, id }) => {
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [controlRows, setControlRows] = useState<
    Array<{
      code: string;
      label: string;
      control: string;
      originalControl: string;
      value_type: "WIDTH" | "LENGTH";
    }>
  >([]);

  const { toast } = useToast();
  const router = useRouter();

  const {
    handleStartMapping,
    handleStopSelecting,
    handleMappingPointClick,
    mappingPathId,
    selectedPointIndex,
    measurementItems,
    handleAdjustableChange,
  } = useManualMapping({
    manual_mapped_path_id: data.manual_mapped_path_id,
    chartTypeId: id,
  });

  const { svgContent, paths, points, svgDimensions } = useSvgContent({
    svg_url: data.svg_url,
  });

  const autoMappingItems = data.mapped_path_id
    .map((mappedPath, i) => {
      const path = paths.find((p) => p.id === mappedPath.code);

      if (!path) {
        return null;
      }

      return getPathDefs(path, points);
    })
    .filter((item) => item !== null);

  const generateControlString = (
    startPointId: string,
    endPointId: string,
    valueType: "WIDTH" | "LENGTH"
  ): string => {
    if (valueType === "WIDTH") {
      const startNum = startPointId.match(/\d+/)?.[0] || "";
      const endNum = endPointId.match(/\d+/)?.[0] || "";
      return `${startNum}-${endNum}`;
    } else {
      const startChar = startPointId.charAt(0);
      const endChar = endPointId.charAt(0);
      return `${startChar}-${endChar}`;
    }
  };

  // 인접한 control 조합만 반환
  const getControlDropdownPairs = (valueType: "WIDTH" | "LENGTH") => {
    if (!points) return [];
    let ids: string[] = [];
    if (valueType === "WIDTH") {
      ids = points
        .map((p: any) => p.id)
        .filter((id: string) => /^\d+$/.test(id))
        .sort((a, b) => Number(a) - Number(b));
    } else {
      ids = points
        .map((p: any) => p.id)
        .filter((id: string) => /^[a-zA-Z]$/.test(id))
        .sort();
    }
    const pairs: string[] = [];
    for (let i = 0; i < ids.length - 1; i++) {
      pairs.push(`${ids[i]}-${ids[i + 1]}`);
    }
    return pairs;
  };

  // control 드롭다운 옵션 (각 row별로)
  const getControlOptionsForRow = (row: { value_type: "WIDTH" | "LENGTH" }) => {
    return getControlDropdownPairs(row.value_type);
  };

  // control 드롭다운에서 선택 시
  const handleControlDropdownChange = (idx: number, value: string) => {
    setControlRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, control: value } : row))
    );
  };

  const handleApiRequest = async (controlRows: Array<SliderControlRowType>) => {
    // API 요청 데이터 구성
    const requestData = {
      name: data.svg_name, // TODO: 실제 이름으로 변경
      svgFileUrl: data.svg_url, // TODO: 실제 S3 URL로 변경
      points: points,
      mappings: {
        auto: autoMappingItems.map((item) => ({
          measurement_code: item.id,
          start_point_id: item.points[0],
          end_point_id: item.points[1],
          slider_default:
            data.mapped_path_id.find((p) => p.code === item.id)
              ?.slider_default ?? false,
          control_points: item.controlPoints,
        })),
        manual: measurementItems.map((item) => ({
          measurement_code: item.id,
          start_point_id: item.startPoint,
          end_point_id: item.endPoint,
          slider_default: item.adjustable,
        })),
        control: controlRows,
      },
    };

    await updateChartTypeSvgMapping(id, requestData);

    toast({
      title: "성공",
      description: "차트 타입이 수정되었습니다.",
    });

    router.push("/chart-types");
  };

  // 모달 오픈 함수
  const openControlModal = () => {
    setIsControlModalOpen(true);
  };

  // 저장 콜백
  const handleSliderControlSave = (rows: Array<SliderControlRowType>) => {
    console.log(rows);
    handleApiRequest(rows);
  };

  const handleSubmit = async () => {
    try {
      const unmappedItems = measurementItems.filter(
        (item) => !item.startPoint || !item.endPoint
      );

      if (unmappedItems.length > 0) {
        toast({
          title: "경고",
          variant: "destructive",
          description: "모든 측정 항목의 매핑을 완료해주세요.",
        });
        return;
      }

      openControlModal();
    } catch (error) {
      toast({
        title: "오류",
        variant: "destructive",
        description: "차트 타입 수정에 실패했습니다.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">차트 유형 수정</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            타입/차트 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-blue-700 underline cursor-pointer hover:text-blue-900">
                    {data.svg_name}
                  </Label>
                  <DownloadButton
                    variant="outline"
                    size="sm"
                    fileUrl={data.svg_url}
                    fileName={data.svg_name}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  SVG에서 path 정보를 자동으로 추출할 수 있습니다.
                </p>
              </div>
            </div>

            {svgContent && (
              <div className="flex items-center gap-8">
                <div
                  className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center"
                  style={{
                    width: previewW,
                    height: previewH,
                    position: "relative",
                  }}
                >
                  <SvgPreview
                    svgContent={svgContent}
                    paths={paths}
                    points={points}
                    onPointClick={handleMappingPointClick}
                    highlightedPathId={hoveredPathId}
                    svgDimensions={svgDimensions}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            자동 매핑 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoMappingTable
            paths={paths}
            mappingItems={autoMappingItems}
            gridPoints={points}
            onPathClick={setHoveredPathId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            관리자 수동 매핑 항목
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ManualMappingTable
            measurementItems={measurementItems}
            selectedPathId={mappingPathId}
            selectedPointIndex={selectedPointIndex}
            handlePathIdClick={handleStartMapping}
            onAdjustableChange={handleAdjustableChange}
            onStopSelecting={handleStopSelecting}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>
      <SliderControlModal
        open={isControlModalOpen}
        onOpenChange={setIsControlModalOpen}
        measurementItems={measurementItems}
        points={points}
        onSave={handleSliderControlSave}
      />
    </div>
  );
};

export default ChartRegistration;

const useManualMapping = (props: {
  manual_mapped_path_id: {
    code: string;
    label: string;
    slider_default: boolean;
  }[];
  chartTypeId: string;
}) => {
  const [measurementItems, setMeasurementItems] = useState<MeasurementItem[]>(
    []
  );

  const [mappingPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const handleStartMapping = (pathId: string) => {
    setSelectedPathId(pathId);
    setSelectedPointIndex(0);
    setIsSelecting(true);
    toast({ title: "시작점 선택 중입니다." });
  };

  const handleStopSelecting = () => {
    setSelectedPathId(null);
    setSelectedPointIndex(0);
    setIsSelecting(false);
    toast({ title: "선택이 중지되었습니다." });
  };

  const handleMappingPointClick = (pointId: string) => {
    if (!isSelecting || !mappingPathId) {
      return;
    }

    const isStartPoint = selectedPointIndex === 0;
    const field = isStartPoint ? "startPoint" : "endPoint";

    setMeasurementItems((prev) =>
      prev.map((item) =>
        item.id === mappingPathId ? { ...item, [field]: pointId } : item
      )
    );

    if (isStartPoint) {
      setSelectedPointIndex(1);
      toast({ title: "끝점 선택 중입니다." });
    } else {
      const currentIndex = measurementItems.findIndex(
        (item) => item.id === mappingPathId
      );
      const nextUnmappedItem = measurementItems
        .slice(currentIndex + 1)
        .find((item) => !item.startPoint || !item.endPoint);

      if (nextUnmappedItem) {
        setSelectedPathId(nextUnmappedItem.id);
        setSelectedPointIndex(0);
        toast({ title: `${nextUnmappedItem.name}의 시작점 선택 중입니다.` });
      } else {
        setSelectedPathId(null);
        setSelectedPointIndex(0);
        setIsSelecting(false);
        toast({ title: "모든 항목의 매핑이 완료되었습니다!" });
      }
    }
  };

  const initMapping = async () => {
    const chartType = await getChartType(props.chartTypeId);

    if (chartType) {
      const manualMappingItems = props.manual_mapped_path_id?.map((item) => {
        const currentMapping = chartType.svg_mapping.mappings.manual.find(
          (map: any) => map.measurement_code === item.code
        );
        return {
          id: item.code,
          name: item.label,
          startPoint: currentMapping?.start_point_id ?? "",
          endPoint: currentMapping?.end_point_id ?? "",
          adjustable: item.slider_default,
          isMultiPath: false,
        };
      });

      setMeasurementItems([...manualMappingItems]);
    } else {
      const manualMappingItems = props.manual_mapped_path_id?.map((item) => ({
        id: item.code,
        name: item.label,
        startPoint: "",
        endPoint: "",
        adjustable: item.slider_default,
        isMultiPath: false,
      }));

      setMeasurementItems([...manualMappingItems]);
    }
  };

  const handleAdjustableChange = (id: string, adjustable: boolean) => {
    setMeasurementItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adjustable } : item))
    );
  };

  useEffect(() => {
    initMapping();
  }, [props.manual_mapped_path_id]);

  return {
    handleStartMapping,
    handleStopSelecting,
    handleMappingPointClick,
    mappingPathId,
    selectedPointIndex,
    measurementItems,
    handleAdjustableChange,
  };
};
