"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { AutoMappingTable } from "./_components/AutoMappingTable";
import { ManualMappingTable } from "./_components/ManualMappingTable";
import { SvgPreview } from "./_components/SvgPreview";
import { fetchSvg } from "./action";
import { ChartPoint } from "./types";
import { getGridPointsFromPaths, extractControlPoints } from "./utils/svgGrid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// 파일 업로드 컴포넌트
interface FileUploadProps {
  fileName: string;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: any) => void;
  onClearFile: () => void;
  previewContent?: React.ReactNode;
  previewW?: number;
  previewH?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileName,
  error,
  fileInputRef,
  onFileUpload,
  onClearFile,
  previewContent,
  previewW = 400,
  previewH = 350,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {fileName ? (
            <Label className="text-blue-700 underline">{fileName}</Label>
          ) : (
            <Label className="text-muted-foreground">
              SVG 파일을 업로드 해주세요.
            </Label>
          )}
          <p className="text-sm text-muted-foreground">
            SVG에서 path 정보를 자동으로 추출할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".svg"
            ref={fileInputRef as React.RefObject<HTMLInputElement>}
            onChange={onFileUpload}
            className="hidden"
          />
          {fileName ? (
            <>
              <Button variant="outline" size="sm" onClick={onClearFile}>
                파일 삭제
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                파일 변경
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 업로드
            </Button>
          )}
        </div>
      </div>

      {fileName && (
        <div className="flex items-center gap-8">
          <div
            className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center"
            style={{ width: previewW, height: previewH, position: "relative" }}
          >
            {previewContent}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
};

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
}> = ({ data }) => {
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

  const svgViewBox = "";

  // SVG 파일을 가져오는 함수
  const fetchSvgContent = async () => {
    try {
      const { content } = await fetchSvg(data.svg_url);
      setSvgContent(content);
      analyzeSVGPaths(content);
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

  // 매핑 항목 초기화
  useEffect(() => {
    const autoMappingItems = data.mapped_path_id.map((item) => ({
      id: item.code,
      name: item.label,
      startPoint: "",
      endPoint: "",
      adjustable: item.slider_default,
      isMultiPath: false,
    }));

    const manualMappingItems = data.manual_mapped_path_id.map((item) => ({
      id: item.code,
      name: item.label,
      startPoint: "",
      endPoint: "",
      adjustable: item.slider_default,
      isMultiPath: false,
    }));

    setMeasurementItems([...autoMappingItems, ...manualMappingItems]);
  }, [data.mapped_path_id, data.manual_mapped_path_id]);

  const analyzeSVGPaths = (content: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(content, "image/svg+xml");
    const pathElements = svgDoc.querySelectorAll("path");

    const rawPaths: SvgPath[] = Array.from(pathElements).map((path, index) => {
      const d = path.getAttribute("d") ?? "";
      const pathId = path.getAttribute("id") || `path-${index}`;
      const isLine = d.includes("L") && !d.includes("C") && !d.includes("Q");
      const rawPoints = extractPathPoints(d);
      return {
        id: pathId,
        element: path,
        data: d,
        type: isLine ? "line" : "curve",
        points: rawPoints,
      };
    });
    // 디버깅: path 개수 및 d 속성 출력
    console.log("SVG path 개수:", rawPaths.length);
    rawPaths.forEach((p, i) => {
      console.log(`path[${i}] id=${p.id} d=${p.data}`);
    });
    const gridPoints = getGridPointsFromPaths(rawPaths);
    setPoints(gridPoints);
    setPaths(rawPaths);
    calculateSVGDimensions(gridPoints);
  };

  const extractPathPoints = (pathData: string): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
    commands.forEach((command) => {
      const type = command[0];
      const coords = command
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      if (type === "M" || type === "L") {
        for (let i = 0; i < coords.length; i += 2) {
          const x = coords[i];
          const y = coords[i + 1];
          if (
            typeof x === "number" &&
            typeof y === "number" &&
            !isNaN(x) &&
            !isNaN(y)
          ) {
            points.push({ x, y });
          }
        }
      }
    });
    return points;
  };

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

  // SVG 원본 크기 fallback 계산 함수 추가
  function getFallbackSvgSize(svgContent: string) {
    const matches = Array.from(
      svgContent.matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi)
    );
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    matches.forEach((match) => {
      const coords =
        match[2]
          ?.trim()
          .split(/[\s,]+/)
          .map(Number)
          .filter((n) => !isNaN(n)) || [];
      for (let i = 0; i < coords.length; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        if (
          typeof x === "number" &&
          typeof y === "number" &&
          !isNaN(x) &&
          !isNaN(y)
        ) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    });
    if (
      minX === Infinity ||
      minY === Infinity ||
      maxX === -Infinity ||
      maxY === -Infinity
    ) {
      return { width: 200, height: 160 };
    }
    return { width: maxX - minX, height: maxY - minY };
  }

  // SVG 좌표계 기준 변환값 계산
  function getSvgOriginAndSize(svgContent: string, svgViewBox: string) {
    if (svgViewBox) {
      const [vx, vy, vw, vh] = svgViewBox.split(/\s+/).map(Number);
      if (
        typeof vx === "number" &&
        typeof vy === "number" &&
        typeof vw === "number" &&
        typeof vh === "number" &&
        !isNaN(vx) &&
        !isNaN(vy) &&
        !isNaN(vw) &&
        !isNaN(vh)
      ) {
        return { originX: vx, originY: vy, width: vw, height: vh };
      }
    }
    // fallback: path bounding box
    const fallback = getFallbackSvgSize(svgContent);
    return {
      originX: 0,
      originY: 0,
      width: fallback.width,
      height: fallback.height,
    };
  }

  // 미리보기 패널 크기 및 viewBox 계산
  const previewW = 400;
  const previewH = 350;
  let svgOriginX = 0,
    svgOriginY = 0,
    svgContentW = 0,
    svgContentH = 0;
  if (svgContent) {
    const { originX, originY, width, height } = getSvgOriginAndSize(
      svgContent,
      svgViewBox
    );
    svgOriginX = originX;
    svgOriginY = originY;
    svgContentW = width;
    svgContentH = height;
  }

  // 미리보기 패널 SVG viewBox 계산 (여백 포함)
  const previewPadding = 30;
  const allX = points.map((p) => p.x);
  const allY = points.map((p) => p.y);
  const minX = Math.min(...allX, svgOriginX);
  const maxX = Math.max(...allX, svgOriginX + svgContentW);
  const minY = Math.min(...allY, svgOriginY);
  const maxY = Math.max(...allY, svgOriginY + svgContentH);
  const svgBoxX = minX - previewPadding;
  const svgBoxY = minY - previewPadding;
  const svgBoxW = maxX - minX + previewPadding * 2;
  const svgBoxH = maxY - minY + previewPadding * 2;

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
        name: "라운드넥 래글런 스웨터 앞몸판", // TODO: 실제 이름으로 변경
        svgFileUrl: "s3url", // TODO: 실제 S3 URL로 변경
        points: points.map((point) => ({
          id: point.id,
          x: point.x,
          y: point.y,
        })),
        mappings: measurementItems.map((item) => ({
          measurement_code: item.id,
          start_point_id: item.startPoint,
          end_point_id: item.endPoint,
          // symmetric: true, // TODO: 실제 값으로 변경
          // curve_type: "cubic" as const, // 타입을 명시적으로 지정
          control_points: [] as { x: number; y: number }[], // 타입을 명시적으로 지정
        })),
      };

      console.log("requestData: ", requestData);
      // API 호출
      // await createChartType(requestData);

      // toast({
      //   title: "성공",
      //   description: "차트 타입이 등록되었습니다.",
      // });

      // router.push("/chart-types");
    } catch (error) {
      toast({
        title: "오류",
        variant: "destructive",
        description: "차트 타입 등록에 실패했습니다.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">차트 유형 등록</h1>
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
                    previewW={previewW}
                    previewH={previewH}
                    svgBoxX={svgBoxX}
                    svgBoxY={svgBoxY}
                    svgBoxW={svgBoxW}
                    svgBoxH={svgBoxH}
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
        <Button onClick={handleSubmit}>등록</Button>
      </div>
    </div>
  );
};

export default ChartRegistration;
