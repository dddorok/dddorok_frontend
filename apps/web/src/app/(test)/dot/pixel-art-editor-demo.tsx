import React, { useState, useRef, useCallback } from "react";

import { BrushTool, BrushToolType, KNITTING_SYMBOLS, Shape } from "./constant";
import { Dotting } from "./pixel-art-editor";
import { DottingRef, useDotting } from "./useDotting";

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
// 픽셀 데이터 타입
interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
}

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
const PixelArtEditor: React.FC = () => {
  const [brushTool, setBrushTool] = useState<BrushToolType>(BrushTool.DOT);
  const [selectedShape, setSelectedShape] = useState<Shape>(
    KNITTING_SYMBOLS[0] as Shape
  );
  const [shapes, setShapes] = useState<Shape[]>(KNITTING_SYMBOLS);
  const dottingRef = useRef<DottingRef | null>(null);
  const { clear, exportImage, undo, redo, canUndo, canRedo } =
    useDotting(dottingRef);

  // 초기 셀 데이터 예시
  const initialCells = [
    { row: 1, col: 1, shape: KNITTING_SYMBOLS[0] }, // 뜨기
    { row: 2, col: 2, shape: KNITTING_SYMBOLS[1] }, // 날리기
  ];

  // 비활성화 셀 예시
  const disabledCells = [
    { row: 0, col: 0 },
    { row: 0, col: 3 },
    { row: 4, col: 0 },
    { row: 4, col: 3 },
  ];

  const handleExport = () => {
    const dataUrl = exportImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "knitting-pattern.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const handleAddShape = (newShape: Shape) => {
    setShapes((prev) => [...prev, newShape]);
  };

  // 키보드 단축키 추가
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">뜨개질 패턴 편집기</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium">브러시 도구:</label>
          <select
            value={brushTool}
            onChange={(e) => setBrushTool(e.target.value as BrushToolType)}
            className="border rounded px-2 py-1"
          >
            <option value={BrushTool.NONE}>없음</option>
            <option value={BrushTool.DOT}>펜</option>
            <option value={BrushTool.ERASER}>지우개</option>
            <option value={BrushTool.SELECT}>선택</option>
            <option value={BrushTool.LINE}>직선</option>
          </select>
        </div>

        <ShapeSelector
          shapes={shapes}
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
        />

        <CustomShapeAdder onAddShape={handleAddShape} />

        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            title="실행 취소 (Ctrl+Z)"
          >
            ↶ 실행취소
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            title="다시 실행 (Ctrl+Y)"
          >
            ↷ 다시실행
          </button>

          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            실행취소: {canUndo ? "가능" : "불가능"} | 다시실행:{" "}
            {canRedo ? "가능" : "불가능"}
          </div>
        </div>

        <button
          onClick={clear}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          지우기
        </button>

        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          내보내기
        </button>
      </div>

      <div className="border-2 border-gray-300 inline-block">
        <Dotting
          ref={dottingRef}
          rows={5}
          cols={4}
          gridSquareLength={30}
          brushTool={brushTool}
          selectedShape={selectedShape}
          shapes={shapes}
          backgroundColor="#f8f9fa"
          gridStrokeColor="#e9ecef"
          isPanZoomable={true}
          zoomSensitivity={0.1}
          initialCells={initialCells}
          disabledCells={disabledCells}
          disabledCellColor="#f0f0f0"
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>사용법:</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>펜 도구: 클릭하거나 드래그해서 선택된 뜨개질 기호로 그리기</li>
          <li>지우개 도구: 클릭하거나 드래그해서 지우기</li>
          <li>
            직선 도구: 클릭해서 시작점 설정, 드래그해서 끝점까지 직선 그리기
          </li>
          <li>선택 도구: 드래그해서 영역 선택</li>
          <li>없음 도구: 마우스 휠로 확대/축소, 드래그로 이동</li>
          <li>뜨개질 기호: 상단의 기호 버튼을 클릭해서 그릴 기호 선택</li>
          <li>도형 추가: "도형 추가" 버튼으로 커스텀 기호 추가</li>
          <li>
            <strong>실행 취소/다시 실행:</strong> Ctrl+Z로 실행 취소, Ctrl+Y
            또는 Ctrl+Shift+Z로 다시 실행
          </li>
          <li>
            <strong>비활성화 셀:</strong> X 표시된 회색 셀은 편집할 수 없는
            비활성화된 영역입니다
          </li>
        </ul>

        <div className="mt-2">
          <p>
            <strong>기본 뜨개질 기호:</strong>
          </p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {KNITTING_SYMBOLS.map((shape) => (
              <span
                key={shape.id}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
                style={{ color: shape.color }}
              >
                {shape.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelArtEditor;
