import { Dotting, DottingRef, useDotting, BrushTool } from "dotting";
import React, { useRef, useState, useEffect } from "react";

// 타입 정의
interface KnittingSymbol {
  id: string;
  color: string;
  symbol: string;
  name: string;
}

interface GridSize {
  width: number;
  height: number;
}

interface PatternData {
  pattern: any[];
  disabledCells: string[];
  gridSize: GridSize;
}

const KnittingPatternEditor: React.FC = () => {
  const dottingRef = useRef<DottingRef>(null);
  const { clear, undo, redo } = useDotting(dottingRef);

  // 뜨개질 기호 정의
  const knittingSymbols: KnittingSymbol[] = [
    { id: "knit", color: "#FFFFFF", symbol: "□", name: "메리야스" },
    { id: "purl", color: "#1F2937", symbol: "•", name: "안뜨기" },
    { id: "yo", color: "#EF4444", symbol: "○", name: "걸어뜨기" },
    { id: "k2tog", color: "#10B981", symbol: "╱", name: "우상 2코 모아뜨기" },
    { id: "ssk", color: "#3B82F6", symbol: "╲", name: "좌상 2코 모아뜨기" },
    { id: "cable", color: "#8B5CF6", symbol: "⟋", name: "케이블" },
    { id: "bobble", color: "#F59E0B", symbol: "●", name: "방울뜨기" },
    { id: "empty", color: "#F9FAFB", symbol: "", name: "빈칸" },
  ];

  const [currentSymbol, setCurrentSymbol] = useState<KnittingSymbol>(
    knittingSymbols[0] || {
      id: "knit",
      color: "#FFFFFF",
      symbol: "□",
      name: "메리야스",
    }
  );
  const [disabledCells, setDisabledCells] = useState<Set<string>>(new Set());
  const [isRestrictMode, setIsRestrictMode] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<GridSize>({ width: 20, height: 15 });
  const [pattern, setPattern] = useState<any[]>([]);

  // 초기 제한된 셀 설정 (격자 사방 1개씩)
  useEffect(() => {
    const initialDisabledCells = new Set<string>();

    // 상단과 하단 가장자리
    for (let col = 0; col < gridSize.width; col++) {
      initialDisabledCells.add(`0-${col}`); // 상단
      initialDisabledCells.add(`${gridSize.height - 1}-${col}`); // 하단
    }

    // 좌측과 우측 가장자리 (모서리 제외)
    for (let row = 1; row < gridSize.height - 1; row++) {
      initialDisabledCells.add(`${row}-0`); // 좌측
      initialDisabledCells.add(`${row}-${gridSize.width - 1}`); // 우측
    }

    setDisabledCells(initialDisabledCells);
  }, [gridSize.width, gridSize.height]);

  // 제한된 셀들을 dotting 라이브러리용 indicatorData로 변환
  const indicatorData = Array.from(disabledCells)
    .map((cellKey) => {
      const parts = cellKey.split("-");
      if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

      const row = parseInt(parts[0], 10);
      const col = parseInt(parts[1], 10);

      if (isNaN(row) || isNaN(col)) return null;

      return {
        rowIndex: row,
        columnIndex: col,
        color: "#9CA3AF", // 회색
      };
    })
    .filter(
      (
        item
      ): item is { rowIndex: number; columnIndex: number; color: string } =>
        item !== null
    );

  // currentSymbol이 변경될 때마다 브러시 색상 업데이트
  useEffect(() => {
    if (dottingRef.current) {
      dottingRef.current.changeBrushColor(currentSymbol.color);
    }
  }, [currentSymbol.color]);

  // dotting 컴포넌트 초기 설정
  useEffect(() => {
    if (dottingRef.current) {
      // 기본 브러시 도구 설정
      dottingRef.current.changeBrushTool({
        color: currentSymbol.color,
        size: 1,
        shape: "square",
      } as any);

      // 데이터 변경 이벤트 리스너 추가 (디버깅용)
      const handleDataChange = (data: any) => {
        console.log("Dotting data changed:", data);
      };

      dottingRef.current.addDataChangeListener(handleDataChange);

      // 클린업 함수
      return () => {
        if (dottingRef.current) {
          dottingRef.current.removeDataChangeListener(handleDataChange);
        }
      };
    }
  }, []);

  // 셀 제한 설정
  const handleCellRestriction = (
    row: number,
    col: number,
    disabled: boolean
  ): void => {
    const cellKey = `${row}-${col}`;
    const newDisabledCells = new Set(disabledCells);

    if (disabled) {
      newDisabledCells.add(cellKey);
    } else {
      newDisabledCells.delete(cellKey);
    }
    setDisabledCells(newDisabledCells);
  };

  // 영역 제한 함수들
  const restrictRectArea = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ): void => {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        handleCellRestriction(row, col, true);
      }
    }
  };

  const restrictCircleArea = (
    centerRow: number,
    centerCol: number,
    radius: number
  ): void => {
    for (let row = 0; row < gridSize.height; row++) {
      for (let col = 0; col < gridSize.width; col++) {
        const distance = Math.sqrt(
          Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
        if (distance <= radius) {
          handleCellRestriction(row, col, true);
        }
      }
    }
  };

  const clearAllRestrictions = (): void => {
    setDisabledCells(new Set());
  };

  // 패턴 저장
  const savePattern = (): void => {
    const patternData: PatternData = {
      pattern: pattern,
      disabledCells: Array.from(disabledCells),
      gridSize: gridSize,
    };
    console.log("패턴 저장:", patternData);
    alert("패턴이 저장되었습니다!");
  };

  return (
    <div className="max-w-7xl mx-auto p-5 bg-white rounded-xl shadow-lg">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">뜨개질 도안 편집기</h2>
        <div className="flex gap-4">
          <div className="text-sm font-medium text-gray-600">
            격자 크기:{" "}
            <strong className="text-gray-800">
              {gridSize.width} × {gridSize.height}
            </strong>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* 사이드바 */}
        <div className="w-72 flex flex-col gap-6">
          {/* 기호 팔레트 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
              뜨개질 기호
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {knittingSymbols.map((symbol: KnittingSymbol) => (
                <button
                  key={symbol.id}
                  onClick={() => setCurrentSymbol(symbol)}
                  className={`
                    flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all text-xs min-h-16 justify-center
                    ${
                      currentSymbol.id === symbol.id
                        ? "border-blue-500 shadow-md shadow-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                  style={{
                    backgroundColor: symbol.color,
                    color:
                      symbol.color === "#FFFFFF" || symbol.color === "#F9FAFB"
                        ? "#333"
                        : "#fff",
                  }}
                  title={symbol.name}
                  type="button"
                >
                  <span className="text-lg font-bold mb-1">
                    {symbol.symbol}
                  </span>
                  <span className="text-center leading-tight">
                    {symbol.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 영역 제한 도구 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
              영역 제한
            </h3>
            <button
              onClick={() => setIsRestrictMode(!isRestrictMode)}
              className={`
                w-full py-2 px-4 border-2 rounded-md cursor-pointer text-sm font-medium transition-all
                ${
                  isRestrictMode
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white border-gray-400 text-gray-600 hover:bg-gray-50"
                }
              `}
              type="button"
            >
              {isRestrictMode ? "제한 모드 끄기" : "제한 모드 켜기"}
            </button>

            {isRestrictMode && (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => restrictRectArea(5, 5, 15, 20)}
                  className="py-2 px-3 border border-gray-300 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  사각형 영역 제한
                </button>
                <button
                  onClick={() => restrictCircleArea(10, 15, 8)}
                  className="py-2 px-3 border border-gray-300 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  원형 영역 제한
                </button>
                <button
                  onClick={clearAllRestrictions}
                  className="py-2 px-3 border border-gray-300 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  모든 제한 해제
                </button>
              </div>
            )}
          </div>

          {/* 제어 버튼 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
              편집 도구
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={clear}
                className="py-2 px-4 border border-gray-400 rounded bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                type="button"
              >
                전체 지우기
              </button>
              <button
                onClick={undo}
                className="py-2 px-4 border border-gray-400 rounded bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                type="button"
              >
                되돌리기
              </button>
              <button
                onClick={redo}
                className="py-2 px-4 border border-gray-400 rounded bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                type="button"
              >
                다시실행
              </button>
              <button
                onClick={savePattern}
                className="py-3 px-4 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 transition-colors mt-2"
                type="button"
              >
                패턴 저장
              </button>
            </div>
          </div>
        </div>

        {/* 캔버스 영역 */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <Dotting
              ref={dottingRef}
              width={gridSize.width * 18}
              height={gridSize.height * 18}
              gridSquareLength={18}
              brushColor={currentSymbol.color}
              backgroundColor="#f8f9fa"
              gridStrokeColor="#e0e0e0"
              isDrawingEnabled={true}
              isInteractionApplicable={true}
              indicatorData={indicatorData}
            />
          </div>

          {/* 정보 패널 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              현재 선택:{" "}
              <strong className="text-gray-800">{currentSymbol.name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              제한된 셀:{" "}
              <strong className="text-gray-800">{disabledCells.size}개</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnittingPatternEditor;
