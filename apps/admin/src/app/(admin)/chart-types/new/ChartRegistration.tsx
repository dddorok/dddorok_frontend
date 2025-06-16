"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { AutoMappingTable } from "./_components/AutoMappingTable";
import { ManualMappingTable } from "./_components/ManualMappingTable";
import { SvgPreview } from "./_components/SvgPreview";
import { fetchSvg } from "./action";
import { ChartPoint } from "./types";
import { getSvgOriginAndSize, previewH, previewW } from "./utils/etc";
import { analyzeSVGPaths } from "./utils/svg-paths";
import { getGridPointsFromPaths, extractControlPoints } from "./utils/svgGrid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getChartType } from "@/services/chart-type";
import { updateChartTypeSvgMapping } from "@/services/chart-type/new";

// const previewW = 400;
// const previewH = 350;

export interface SvgPath {
  id: string;
  element: SVGPathElement;
  data: string;
  type: "line" | "curve";
  points: { x: number; y: number }[];
  matchedStartPointId?: string;
  matchedEndPointId?: string;
}

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
  const [svgContent, setSvgContent] = useState<string>("");
  const [paths, setPaths] = useState<SvgPath[]>([]);
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [measurementItems, setMeasurementItems] = useState<MeasurementItem[]>(
    []
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [svgDimensions, setSvgDimensions] = useState<{
    width: number;
    height: number;
    minX: number;
    minY: number;
  }>({ width: 0, height: 0, minX: 0, minY: 0 });
  const [scale, setScale] = useState<number>(1);
  const svgRef = useRef<HTMLDivElement>(null);

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);

  const { toast } = useToast();
  const router = useRouter();

  // SVG 파일을 가져오는 함수
  const fetchSvgContent = async () => {
    try {
      const { content } = await fetchSvg(data.svg_url);
      setSvgContent(content);
      const { gridPoints, rawPaths } = analyzeSVGPaths(content);
      setPoints(gridPoints);
      setPaths(rawPaths);
      calculateSVGDimensions(gridPoints);
    } catch (error) {
      toast({
        title: "오류",
        variant: "destructive",
        description: "SVG 파일을 가져오는데 실패했습니다.",
      });
    }
  };

  // 컴포넌트 마운트 시 SVG 파일 가져오기
  useEffect(() => {
    fetchSvgContent();
  }, [data.svg_url]);

  const initMapping = async () => {
    const chartType = await getChartType(id);
    console.log("chartType: ", chartType);

    if (chartType) {
      const manualMappingItems = data.manual_mapped_path_id?.map((item) => {
        const currentMapping = chartType.svg_mapping.mappings.find(
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
      const manualMappingItems = data.manual_mapped_path_id?.map((item) => ({
        id: item.code,
        name: item.label,
        startPoint: "",
        endPoint: "",
        // 개발용
        // startPoint: "f4",
        // endPoint: "e4",
        adjustable: item.slider_default,
        isMultiPath: false,
      }));

      setMeasurementItems([...manualMappingItems]);
    }
  };

  // 매핑 항목 초기화
  useEffect(() => {
    initMapping();
  }, [data.mapped_path_id, data.manual_mapped_path_id]);

  const calculateSVGDimensions = (allPoints: ChartPoint[]) => {
    if (allPoints.length === 0) return;
    const xCoords = allPoints.map((p) => p.x);
    const yCoords = allPoints.map((p) => p.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    const width = maxX - minX;
    const height = maxY - minY;

    const containerWidth = 560;
    const containerHeight = 384;
    const padding = 40;
    const scaleX = (containerWidth - padding * 2) / width;
    const scaleY = (containerHeight - padding * 2) / height;
    const calculatedScale = Math.min(scaleX, scaleY, 1);

    setSvgDimensions({ width, height, minX, minY });
    setScale(calculatedScale);
  };

  const handlePathIdClick = (pathId: string) => {
    setSelectedPathId(pathId);
    setSelectedPointIndex(0);
    setIsSelecting(true);
    toast({ title: "시작점 선택 중입니다." });
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelecting || !selectedPathId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left) / scale + svgDimensions.minX;
    const offsetY = (e.clientY - rect.top) / scale + svgDimensions.minY;

    const selectedPath = paths.find((p) => p.id === selectedPathId);
    if (!selectedPath) return;

    let closest: ChartPoint | null = null;
    let minDist = Infinity;
    for (const pt of points) {
      const dist = Math.sqrt((pt.x - offsetX) ** 2 + (pt.y - offsetY) ** 2);
      if (dist < 10 && dist < minDist) {
        closest = pt;
        minDist = dist;
      }
    }

    if (closest) {
      // 현재 선택된 점이 시작점인지 끝점인지 확인
      const isStartPoint = selectedPointIndex === 0;
      const field = isStartPoint ? "startPoint" : "endPoint";

      setMeasurementItems((prev) =>
        prev.map((item) =>
          item.id === selectedPathId ? { ...item, [field]: closest.id } : item
        )
      );

      // 다음 점 선택을 위해 인덱스 증가
      if (isStartPoint) {
        setSelectedPointIndex(1);
        toast({ title: "끝점 선택 중입니다." });
      } else {
        // 모든 점이 선택되었으면 초기화
        setSelectedPathId(null);
        setSelectedPointIndex(0);
        setIsSelecting(false);
        toast({ title: "끝점 선택 완료!" });
      }
    }
  };

  const handlePointClick = (pointId: string) => {
    if (!isSelecting || !selectedPathId) {
      setSelectedPointId(pointId);
      return;
    }

    const isStartPoint = selectedPointIndex === 0;
    const field = isStartPoint ? "startPoint" : "endPoint";

    setMeasurementItems((prev) =>
      prev.map((item) =>
        item.id === selectedPathId ? { ...item, [field]: pointId } : item
      )
    );

    if (isStartPoint) {
      setSelectedPointIndex(1);
      toast({ title: "끝점 선택 중입니다." });
    } else {
      setSelectedPathId(null);
      setSelectedPointIndex(0);
      setIsSelecting(false);
      toast({ title: "끝점 선택 완료!" });
    }
  };

  const handleAdjustableChange = (id: string, adjustable: boolean) => {
    setMeasurementItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adjustable } : item))
    );
  };

  const handleSubmit = async () => {
    try {
      // 모든 측정 항목이 매핑되었는지 확인
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

      // API 요청 데이터 구성
      const requestData = {
        name: data.svg_name, // TODO: 실제 이름으로 변경
        svgFileUrl: data.svg_url, // TODO: 실제 S3 URL로 변경
        points: points.map((point) => ({
          id: point.id,
          x: point.x,
          y: point.y,
        })),
        mappings: measurementItems.map((item) => ({
          measurement_code: item.id,
          start_point_id: item.startPoint,
          end_point_id: item.endPoint,
          symmetric: true, // TODO: 실제 값으로 변경
          curve_type: "line" as const, // 타입을 명시적으로 지정
          control_points: [], // 타입을 명시적으로 지정
        })),
      };

      console.log("requestData: ", requestData);
      const response = await updateChartTypeSvgMapping(id, requestData);
      console.log("response: ", response);

      toast({
        title: "성공",
        description: "차트 타입이 수정되었습니다.",
      });

      router.push("/chart-types");
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
                <Label className="text-blue-700 underline">
                  {data.svg_name}
                </Label>
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
                    // previewW={previewW}
                    // previewH={previewH}
                    // svgBoxX={svgBoxX}
                    // svgBoxY={svgBoxY}
                    // svgBoxW={svgBoxW}
                    // svgBoxH={svgBoxH}
                    handleSvgClick={handleSvgClick}
                    isSelecting={isSelecting}
                    selectedPathId={selectedPathId}
                    selectedPointIndex={selectedPointIndex}
                    selectedPointId={selectedPointId}
                    measurementItems={measurementItems}
                    onPointClick={handlePointClick}
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
            gridPoints={points}
            extractControlPoints={extractControlPoints}
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
            selectedPathId={selectedPathId}
            selectedPointIndex={selectedPointIndex}
            handlePathIdClick={handlePathIdClick}
            onAdjustableChange={handleAdjustableChange}
          />
          {/* <p className="text-sm text-destructive mt-2">
            {selectedPathId && selectedPointIndex === 0
              ? "시작점을 선택해주세요."
              : selectedPathId && selectedPointIndex === 1
                ? "끝점을 선택해주세요."
                : "* 매핑되지 않은 항목이 있습니다. 모든 항목의 매핑을 완료해주세요."}
          </p> */}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>
    </div>
  );
};

export default ChartRegistration;
