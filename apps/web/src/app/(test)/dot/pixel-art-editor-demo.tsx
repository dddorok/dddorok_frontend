import React, { useState, useRef } from "react";

import Toolbar from "./_components/Toolbar";
import { BrushTool, BrushToolType } from "./constant";
import { Dotting } from "./pixel-art-editor";
import {
  usePixelArtEditorContext,
  PixelArtEditorProvider,
  usePixelArtEditorCopyContext,
  usePixelArtEditorHistoryContext,
} from "./PixelArtEditorContext";
import { KNITTING_SYMBOLS, Shape } from "./Shape.constants";
import { DottingRef, useDotting } from "./useDotting";

import { Button } from "@/components/ui/button";

// 기본 도형들
const renderCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
};

// 도형 선택 컴포넌트
const ShapeSelector: React.FC<{
  shapes: Shape[];
  selectedShape: Shape;
  onShapeSelect: (shape: Shape) => void;
}> = ({ shapes, selectedShape, onShapeSelect }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">도형:</label>
      <div className="flex gap-1 p-1 bg-gray-100 rounded max-w-md overflow-x-auto">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onShapeSelect(shape)}
            className={`min-w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
              selectedShape.id === shape.id
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            style={{ color: shape.color }}
            title={shape.name}
          >
            <canvas
              width={32}
              height={32}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.clearRect(0, 0, 32, 32);
                    shape.render(ctx, 0, 0, 32, shape.color);
                  }
                }
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// 외부 도형 추가 컴포넌트
const CustomShapeAdder: React.FC<{
  onAddShape: (shape: Shape) => void;
}> = ({ onAddShape }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeName, setShapeName] = useState("");
  const [shapeColor, setShapeColor] = useState("#000000");

  const handleAddShape = () => {
    if (shapeName && shapeColor) {
      const newShape: Shape = {
        id: `custom_${Date.now()}`,
        name: shapeName,
        color: shapeColor,
        render: renderCircle, // 기본값으로 원 사용
      };
      onAddShape(newShape);
      setShapeName("");
      setShapeColor("#000000");
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
      >
        도형 추가
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">새 도형 추가</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  value={shapeName}
                  onChange={(e) => setShapeName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="도형 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">색상</label>
                <input
                  type="color"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="w-full h-10 border rounded"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>기본 원 모양으로 추가됩니다.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddShape}
                disabled={!shapeName}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                추가
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 데모 컴포넌트
interface Cell {
  row: number;
  col: number;
  shape: Shape | undefined;
}

const PixelArtEditor = ({
  initialCells,
  grid_col,
  disabledCells,
  grid_row,
  dottingRef,
}: {
  initialCells: Cell[];
  disabledCells: Cell[];
  grid_col: number;
  grid_row: number;
  dottingRef: React.RefObject<DottingRef>;
}) => {
  const { brushTool, setBrushTool, selectedShape } = usePixelArtEditorContext();

  const selectedArea = dottingRef.current?.getSelectedArea();
  // const handleExport = () => {
  //   const dataUrl = exportImage();
  //   if (dataUrl) {
  //     const link = document.createElement("a");
  //     link.download = "knitting-pattern.png";
  //     link.href = dataUrl;
  //     link.click();
  //   }
  // };

  return (
    <div className="p-4">
      <Toolbar />

      <div className="border-2 border-gray-300 inline-block max-w-[100vw] overflow-auto">
        <Dotting
          ref={dottingRef}
          rows={grid_row}
          cols={grid_col}
          gridSquareLength={30}
          brushTool={brushTool}
          selectedShape={selectedShape}
          shapes={KNITTING_SYMBOLS}
          backgroundColor="#f8f9fa"
          gridStrokeColor="#e9ecef"
          isPanZoomable={false}
          // zoomSensitivity={0.1}
          initialCells={initialCells}
          disabledCells={disabledCells}
          disabledCellColor="#f0f0f0"
        />
      </div>
    </div>
  );
};

// PixelArtEditorProvider로 PixelArtEditor를 감싸서 export
const PixelArtEditorWithProvider = (props: any) => {
  const dottingRef = useRef<DottingRef | null>(null);
  return (
    <PixelArtEditorProvider dottingRef={dottingRef}>
      <PixelArtEditor {...props} dottingRef={dottingRef} />
    </PixelArtEditorProvider>
  );
};

export default PixelArtEditorWithProvider;
