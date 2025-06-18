import {
  analyzeSVGPaths,
  getGridPointsFromPaths,
  SvgPath,
} from "@dddorok/utils/chart/svg-grid";
import { ChartPoint } from "@dddorok/utils/chart/types";
import { useState, useEffect } from "react";

import { fetchSvg } from "../action";

import { toast } from "@/hooks/use-toast";

export const useSvgContent = (props: { svg_url: string }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [paths, setPaths] = useState<SvgPath[]>([]);
  const [points, setPoints] = useState<ChartPoint[]>([]);

  const [svgDimensions, setSvgDimensions] = useState<{
    width: number;
    height: number;
    minX: number;
    minY: number;
    scale: number;
  }>({ width: 0, height: 0, minX: 0, minY: 0, scale: 1 });

  const fetchSvgContent = async () => {
    try {
      const { content } = await fetchSvg(props.svg_url);
      setSvgContent(content);

      const rawPaths = analyzeSVGPaths(content);
      setPaths(rawPaths);

      const gridPoints = getGridPointsFromPaths(rawPaths);
      setPoints(gridPoints);
      calculateSVGDimensions(gridPoints);
    } catch (error) {
      toast({
        title: "오류",
        variant: "destructive",
        description: "SVG 파일을 가져오는데 실패했습니다.",
      });
    }
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

    setSvgDimensions({ width, height, minX, minY, scale: calculatedScale });
  };

  // 컴포넌트 마운트 시 SVG 파일 가져오기
  useEffect(() => {
    fetchSvgContent();
  }, [props.svg_url]);

  return {
    svgContent,
    paths,
    points,
    svgDimensions,
  };
};
