import React, { useRef, useState } from 'react';
import { Dotting, DottingRef, useDotting, useData, BrushTool } from 'dotting';

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
  const { data, setData } = useData(dottingRef);
  
  // 뜨개질 기호 정의
  const knittingSymbols: KnittingSymbol[] = [
    { id: 'knit', color: '#FFFFFF', symbol: '□', name: '메리야스' },
    { id: 'purl', color: '#1F2937', symbol: '•', name: '안뜨기' },
    { id: 'yo', color: '#EF4444', symbol: '○', name: '걸어뜨기' },
    { id: 'k2tog', color: '#10B981', symbol: '╱', name: '우상 2코 모아뜨기' },
    { id: 'ssk', color: '#3B82F6', symbol: '╲', name: '좌상 2코 모아뜨기' },
    { id: 'cable', color: '#8B5CF6', symbol: '⟋', name: '케이블' },
    { id: 'bobble', color: '#F59E0B', symbol: '●', name: '방울뜨기' },
    { id: 'empty', color: '#F9FAFB', symbol: '', name: '빈칸' }
  ];
  
  const [currentSymbol, setCurrentSymbol] = useState<KnittingSymbol>(knittingSymbols[0]);
  const [disabledCells, setDisabledCells] = useState<Set<string>>(new Set());
  const [isRestrictMode, setIsRestrictMode] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<GridSize>({ width: 30, height: 20 });

  // dotting 데이터를 패턴으로 동기화
  const updatePattern = () => {
    if (data) {
      setPattern(data);
    }
  };

  // 패턴 데이터 (dotting의 data와 동기화)
  const [pattern, setPattern] = useState<any[]>([]);

  // 셀 클릭/드래그 시 제한된 셀 체크
  const handleBeforeDraw = (rowIndex: number, columnIndex: number) => {
    const cellKey = `${rowIndex}-${columnIndex}`;
    // 제한된 셀이면 그리기 방지
    return !disabledCells.has(cellKey);
  };

  // 셀 제한 설정
  const handleCellRestriction = (row: number, col: number, disabled: boolean): void => {
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
  const restrictRectArea = (startRow: number, startCol: number, endRow: number, endCol: number): void => {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        handleCellRestriction(row, col, true);
      }
    }
  };
  
  const restrictCircleArea = (centerRow: number, centerCol: number, radius: number): void => {
    for (let row = 0; row < gridSize.height; row++) {
      for (let col = 0; col < gridSize.width; col++) {
        const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
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
    updatePattern(); // 최신 데이터로 업데이트
    const patternData: PatternData = {
      pattern: data || [],
      disabledCells: Array.from(disabledCells),
      gridSize: gridSize
    };
    console.log('패턴 저장:', patternData);
    alert('패턴이 저장되었습니다!');
  };

  // 격자 크기 변경 핸들러
  const handleGridWidthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setGridSize({ ...gridSize, width: value });
    }
  };

  const handleGridHeightChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setGridSize({ ...gridSize, height: value });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto p-5 bg-white rounded-xl shadow-lg">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">뜨개질 도안 편집기</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            가로: 
            <input 
              type="number" 
              value={gridSize.width} 
              onChange={handleGridWidthChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              min="10" 
              max="50"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            세로: 
            <input 
              type="number" 
              value={gridSize.height} 
              onChange={handleGridHeightChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              min="10" 
              max="50"
            />
          </label>
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
                    ${currentSymbol.id === symbol.id 
                      ? 'border-blue-500 shadow-md shadow-blue-200' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  style={{ 
                    backgroundColor: symbol.color,
                    color: symbol.color === '#FFFFFF' || symbol.color === '#F9FAFB' ? '#333' : '#fff'
                  }}
                  title={symbol.name}
                  type="button"
                >
                  <span className="text-lg font-bold mb-1">{symbol.symbol}</span>
                  <span className="text-center leading-tight">{symbol.name}</span>
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
                ${isRestrictMode 
                  ? 'bg-red-500 border-red-500 text-white' 
                  : 'bg-white border-gray-400 text-gray-600 hover:bg-gray-50'
                }
              `}
              type="button"
            >
              {isRestrictMode ? '제한 모드 끄기' : '제한 모드 켜기'}
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
              width={600}
              height={400}
              gridSquareLength={18}
              brushTool={BrushTool.DOT}
              brushColor={currentSymbol.color}
              maxCol={gridSize.width}
              maxRow={gridSize.height}
              minCol={10}
              minRow={10}
              backgroundColor="#f8f9fa"
              gridLineColor="#e0e0e0"
              onDraw={(rowIndex: number, columnIndex: number, color: string) => {
                // 그리기 완료 후 패턴 업데이트
                updatePattern();
              }}
              beforeDraw={handleBeforeDraw}
            />
            
            {/* 비활성화된 셀 오버레이 */}
            <div className="absolute top-0 left-0 pointer-events-none w-full h-full">
              {Array.from(disabledCells).map((cellKey: string) => {
                const [row, col] = cellKey.split('-').map(Number);
                return (
                  <div
                    key={cellKey}
                    className="absolute w-4.5 h-4.5 pointer-events-none z-10"
                    style={{
                      left: col * 18,
                      top: row * 18,
                      background: `repeating-linear-gradient(
                        45deg,
                        rgba(239, 68, 68, 0.1),
                        rgba(239, 68, 68, 0.1) 3px,
                        rgba(239, 68, 68, 0.2) 3px,
                        rgba(239, 68, 68, 0.2) 6px
                      )`
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* 정보 패널 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              현재 선택: <strong className="text-gray-800">{currentSymbol.name}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              격자 크기: <strong className="text-gray-800">{gridSize.width} × {gridSize.height}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              제한된 셀: <strong className="text-gray-800">{disabledCells.size}개</strong>
            </p>
            <p className="text-sm text-gray-600">
              그린 셀: <strong className="text-gray-800">{data?.length || 0}개</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnittingPatternEditor;