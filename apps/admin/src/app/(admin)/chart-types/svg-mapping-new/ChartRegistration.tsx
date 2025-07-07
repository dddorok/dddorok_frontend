"use client";

import { getPathDefs } from "@dddorok/utils/chart/svg-path";
import React, { useState, useEffect } from "react";

import { ManualMappingTable } from "./ManualMappingTable";
import { SvgPreview } from "./SvgPreview";
import { AutoMappingTable } from "../new/_components/AutoMappingTable";
import { useSvgContent } from "../new/hooks/useSvgContent";
import { previewH, previewW } from "../new/utils/etc";

import { DownloadButton } from "@/components/DownloadButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getChartType } from "@/services/chart-type";

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
  const { handleMappingPointClick, measurementItems } = useManualMapping({
    manual_mapped_path_id: data.manual_mapped_path_id,
    chartTypeId: id,
  });

  const { svgContent, paths, points, svgDimensions } = useSvgContent({
    svg_url: data.svg_url,
  });

  const [xIntervals, setXIntervals] = useState<number[]>([]);
  const [yIntervals, setYIntervals] = useState<number[]>([]);

  useEffect(() => {
    if (points.length > 0) {
      const xs = Array.from(new Set(points.map((p) => p.x))).sort(
        (a, b) => a - b
      );
      const ys = Array.from(new Set(points.map((p) => p.y))).sort(
        (a, b) => a - b
      );
      setXIntervals(Array(xs.length - 1).fill(1));
      setYIntervals(Array(ys.length - 1).fill(1));
    }
  }, [points]);

  const handleXIntervalChange = (idx: number, value: number) => {
    setXIntervals((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };
  const handleYIntervalChange = (idx: number, value: number) => {
    setYIntervals((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const autoMappingItems = data.mapped_path_id
    .map((mappedPath) => {
      const path = paths.find((p) => p.id === mappedPath.code);

      if (!path) {
        return null;
      }

      return getPathDefs(path, points);
    })
    .filter((item) => item !== null);

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
              <div className="flex items-start gap-8">
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
                    xIntervals={xIntervals}
                    yIntervals={yIntervals}
                  />
                </div>
                <div className="flex flex-col gap-6 min-w-[220px]">
                  <div>
                    <div className="font-semibold mb-2">X축 구간별 비율</div>
                    <div className="flex flex-col gap-2">
                      {xIntervals.map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-8 text-right text-xs text-gray-500">
                            {i + 1}~{i + 2}
                          </span>
                          <input
                            type="range"
                            min={0.2}
                            max={2}
                            step={0.01}
                            value={val}
                            onChange={(e) =>
                              handleXIntervalChange(i, Number(e.target.value))
                            }
                            className="flex-1"
                          />
                          <span className="w-8 text-xs">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Y축 구간별 비율</div>
                    <div className="flex flex-col gap-2">
                      {yIntervals.map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-8 text-right text-xs text-gray-500">
                            {String.fromCharCode(97 + i)}~
                            {String.fromCharCode(97 + i + 1)}
                          </span>
                          <input
                            type="range"
                            min={0.2}
                            max={2}
                            step={0.01}
                            value={val}
                            onChange={(e) =>
                              handleYIntervalChange(i, Number(e.target.value))
                            }
                            className="flex-1"
                          />
                          <span className="w-8 text-xs">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
          <ManualMappingTable measurementItems={measurementItems} />
        </CardContent>
      </Card>
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
        const currentMapping = chartType.svg_mapping.mappings.manual?.find(
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
