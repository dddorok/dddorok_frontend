import { Point } from "@dddorok/utils";

import { GridAdjustments } from "../types";

// 2D 그리드 구조에서 control별로 전체 행/열에 비율 적용
export const getAdjustedPoints = (
  initialPoints: Point[],
  gridAdjustments: GridAdjustments,
  controls: string[]
): Point[] => {
  if (initialPoints.length === 0) return [];

  // 1. id에서 행(row), 열(col) 추출 (예: a1, b2)
  const parseId = (id: string) => {
    const match = id.match(/^([a-zA-Z]+)(\d+)$/);
    if (!match) return { row: "", col: "" };
    return { row: match[1], col: match[2] };
  };

  // 2. 2D 그리드로 변환
  const gridMap: Record<string, Record<string, Point>> = {};
  const rowsSet = new Set<string>();
  const colsSet = new Set<string>();
  initialPoints.forEach((p) => {
    if (!p.id) return;
    const { row, col } = parseId(p.id);
    if (!row || !col) return;
    if (!gridMap[row]) gridMap[row] = {};
    gridMap[row][col] = { ...p };
    rowsSet.add(row);
    colsSet.add(col);
  });
  const rows = Array.from(rowsSet).sort();
  const cols = Array.from(colsSet).sort((a, b) => parseInt(a) - parseInt(b));

  // 3. X축(열) 간격 control (예: 1-2, 2-3 ...)
  for (let c = 0; c < cols.length - 1; c++) {
    const control = `${cols[c]}-${cols[c + 1]}`;
    const ratio = gridAdjustments[control] ?? 1;

    for (const row of rows) {
      if (!gridMap[row]) continue;

      if (!gridMap[row][cols[c] as string]) continue;
      if (!gridMap[row][cols[c + 1] as string]) continue;
      const p1 = gridMap[row][cols[c] as string];
      const p2 = gridMap[row][cols[c + 1] as string];
      if (!p1 || !p2) continue;
      // p2를 p1 기준으로 비율 적용
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      gridMap[row][cols[c + 1] as string] = {
        ...p2,
        x: p1.x + dx * ratio,
        y: p1.y + dy * ratio,
      };
    }
  }

  // 4. Y축(행) 간격 control (예: a-b, b-c ...)
  for (let r = 0; r < rows.length - 1; r++) {
    const control = `${rows[r]}-${rows[r + 1]}`;
    const ratio = gridAdjustments[control] ?? 1;
    if (!gridMap[rows[r] as string]) continue;
    if (!gridMap[rows[r + 1] as string]) continue;
    for (const col of cols) {
      const gridRow = gridMap[rows[r] as string];
      const gridRowNext = gridMap[rows[r + 1] as string];
      if (!gridRow) continue;
      if (!gridRowNext) continue;
      if (!gridRow[col]) continue;
      const p1 = gridRow[col];
      const p2 = gridRowNext[col];
      if (!p1 || !p2) continue;
      // p2를 p1 기준으로 비율 적용
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      gridRowNext[col] = {
        ...p2,
        x: p1.x + dx * ratio,
        y: p1.y + dy * ratio,
      };
    }
  }

  // 5. 2D 그리드를 1D Point[]로 평탄화 (행 우선)
  const adjustedPoints: Point[] = [];
  for (const row of rows) {
    if (!gridMap[row]) continue;
    for (const col of cols) {
      if (!gridMap[row][col]) continue;
      const p = gridMap[row][col];
      if (p) adjustedPoints.push(p);
    }
  }
  return adjustedPoints;
};
