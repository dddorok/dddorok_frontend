# 픽셀 아트 에디터 선언적 리팩토링 상세 가이드

## 🚨 발견된 문제

사용자가 **드래그나 LINE 브러시로 여러 셀을 한 번에 그릴 때 비활성화 셀이 무시되는** 버그가 발생했습니다.

### 문제의 근본 원인

```typescript
// ❌ 문제가 있던 기존 코드
const drawContinuousLine = useCallback(() => {
  const linePixels = interpolatePixels(fromRow, fromCol, toRow, toCol, shape);

  setPixels((prev) => {
    const newPixels = [...prev];
    // 🚨 비활성화 셀 체크 없이 모든 픽셀을 적용
    linePixels.forEach((pixel) => {
      if (!newPixels[pixel.rowIndex]) newPixels[pixel.rowIndex] = [];
      newPixels[pixel.rowIndex]![pixel.columnIndex] = pixel;
    });
    return newPixels;
  });
}, []);
```

**원인**: 비활성화 셀 체크 로직이 **일관성 없이** 구현되어 있었고, 일부 함수에서는 **완전히 누락**되었습니다.

---

## 🔍 기존 코드의 문제점

### 1. 중복되고 일관성 없는 검증 로직

```typescript
// ❌ setPixel에서는 체크함
const setPixel = useCallback((row, col, shape) => {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return; // 위치 체크

  setPixels((prev) => {
    const existingPixel = newPixels[row]?.[col];
    if (existingPixel?.disabled) return prev; // 비활성화 체크
    // 복잡한 픽셀 할당 로직...
  });
}, []);

// ❌ drawContinuousLine에서는 체크 안함
const drawContinuousLine = useCallback(() => {
  // 위치 체크 없음!
  // 비활성화 체크 없음!
  linePixels.forEach((pixel) => {
    newPixels[pixel.rowIndex]![pixel.columnIndex] = pixel; // 직접 할당!
  });
}, []);
```

### 2. 의도가 불분명한 복잡한 조건문

```typescript
// ❌ 무엇을 하려는지 알기 어려운 코드
if (row >= 0 && row < rows && col >= 0 && col < cols) {
  const existingPixel = newPixels[row]?.[col];
  if (!existingPixel?.disabled) {
    if (!newPixels[row]) newPixels[row] = [];
    const targetRow = newPixels[row];
    if (targetRow) {
      const existingDisabled = targetRow[col]?.disabled || false;
      targetRow[col] = shape
        ? createPixel(row, col, shape, existingDisabled)
        : existingDisabled
          ? createPixel(row, col, null, true)
          : null;
    }
  }
}
```

이 코드를 보고 "이 코드가 비활성화 셀을 체크하고 안전하게 픽셀을 그리는 코드구나"라고 바로 알 수 있나요? 🤔

---

## 🎯 해결 방향: 선언적 프로그래밍

### 핵심 아이디어

**"어떻게(How)"가 아닌 "무엇을(What)"**에 집중하여 코드의 의도를 명확히 표현하자!

```typescript
// ❌ 절차적: 어떻게 할 것인가
if (row >= 0 && row < rows && col >= 0 && col < cols) {
  const existingPixel = newPixels[row]?.[col];
  if (!existingPixel?.disabled) {
    // 복잡한 할당 로직...
  }
}

// ✅ 선언적: 무엇을 할 것인가
if (canDrawOnCell(row, col, rows, cols, pixels)) {
  applyPixelWithDisabledCheck(newPixels, row, col, shape, rows, cols);
}
```

### 왜 이 방법이 좋은가?

1. **가독성**: 함수명만 보고도 의도를 알 수 있음
2. **재사용성**: 동일한 로직을 여러 곳에서 일관되게 사용
3. **테스트 용이성**: 각 함수를 독립적으로 테스트 가능
4. **유지보수성**: 로직 변경 시 한 곳만 수정하면 됨

---

## 🛠️ 해결 과정

### 1단계: 핵심 유틸리티 함수 설계

#### 비활성화 셀 체크 함수들

```typescript
// 위치가 유효한가?
const isValidPosition = (
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean => {
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

// 셀이 비활성화되어 있는가?
const isCellDisabled = (
  row: number,
  col: number,
  pixels: (Pixel | null)[][]
): boolean => {
  const existingPixel = pixels[row]?.[col];
  return existingPixel?.disabled || false;
};

// 이 셀에 그릴 수 있는가? (최종 판단)
const canDrawOnCell = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  pixels: (Pixel | null)[][]
): boolean => {
  return (
    isValidPosition(row, col, rows, cols) && !isCellDisabled(row, col, pixels)
  );
};
```

**핵심 원칙**:

- 각 함수는 **하나의 명확한 질문**에 답함
- 함수명이 곧 **코드의 문서화**
- 작은 함수들을 **조합**하여 복잡한 로직 구성

#### 픽셀 처리 함수들

```typescript
// 그릴 수 있는 픽셀만 걸러내기
const filterDrawablePixels = (
  pixelsToFilter: Pixel[],
  rows: number,
  cols: number,
  currentPixels: (Pixel | null)[][]
): Pixel[] => {
  return pixelsToFilter.filter((pixel) =>
    canDrawOnCell(pixel.rowIndex, pixel.columnIndex, rows, cols, currentPixels)
  );
};

// 안전하게 픽셀 적용하기
const applyPixelWithDisabledCheck = (
  newPixels: (Pixel | null)[][],
  row: number,
  col: number,
  shape: Shape | null,
  rows: number,
  cols: number
): void => {
  if (!canDrawOnCell(row, col, rows, cols, newPixels)) return;

  // 실제 픽셀 적용 로직
  if (!newPixels[row]) newPixels[row] = [];
  const targetRow = newPixels[row];
  if (targetRow) {
    const existingDisabled = targetRow[col]?.disabled || false;
    targetRow[col] = shape
      ? createPixel(row, col, shape, existingDisabled)
      : existingDisabled
        ? createPixel(row, col, null, true)
        : null;
  }
};
```

### 2단계: 기존 함수들을 선언적으로 리팩토링

#### Before: 절차적 접근

```typescript
// ❌ 복잡하고 의도가 불분명한 기존 코드
const setPixel = useCallback(
  (row: number, col: number, shape: Shape | null) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    setPixels((prev) => {
      const newPixels = [...prev];
      const existingPixel = newPixels[row]?.[col];
      if (existingPixel?.disabled) return prev;

      if (!newPixels[row]) newPixels[row] = [];
      const targetRow = newPixels[row];
      if (targetRow) {
        const existingDisabled = targetRow[col]?.disabled || false;
        targetRow[col] = shape
          ? createPixel(row, col, shape, existingDisabled)
          : existingDisabled
            ? createPixel(row, col, null, true)
            : null;
      }
      return newPixels;
    });
  },
  [rows, cols]
);

const drawContinuousLine = useCallback(() => {
  const linePixels = interpolatePixels(fromRow, fromCol, toRow, toCol, shape);

  setPixels((prev) => {
    const newPixels = [...prev];
    // 🚨 비활성화 셀 체크 없음!
    linePixels.forEach((pixel) => {
      if (!newPixels[pixel.rowIndex]) newPixels[pixel.rowIndex] = [];
      newPixels[pixel.rowIndex]![pixel.columnIndex] = pixel;
    });
    return newPixels;
  });
}, []);
```

#### After: 선언적 접근

```typescript
// ✅ 의도가 명확하고 일관성 있는 개선된 코드
const setPixel = useCallback(
  (row: number, col: number, shape: Shape | null) => {
    if (!canDrawOnCell(row, col, rows, cols, pixels)) return;

    setPixels((prev) => {
      const newPixels = [...prev];
      applyPixelWithDisabledCheck(newPixels, row, col, shape, rows, cols);
      return newPixels;
    });
  },
  [rows, cols, pixels]
);

const drawContinuousLine = useCallback(() => {
  const linePixels = interpolatePixels(fromRow, fromCol, toRow, toCol, shape);
  const drawablePixels = filterDrawablePixels(linePixels, rows, cols, pixels);

  setPixels((prev) => {
    const newPixels = [...prev];
    drawablePixels.forEach((pixel) => {
      applyPixelWithDisabledCheck(
        newPixels,
        pixel.rowIndex,
        pixel.columnIndex,
        pixel.shape,
        rows,
        cols
      );
    });
    return newPixels;
  });
}, [rows, cols, pixels]);
```

### 3단계: 히스토리 관리도 선언적으로

#### Before: 복잡한 히스토리 로직

```typescript
// ❌ 복잡하고 반복적인 히스토리 관리
const saveToHistory = useCallback(
  (newPixels) => {
    if (isApplyingHistory) return;

    const historyData = newPixels.map((row) =>
      row
        ? row.map((pixel) =>
            pixel
              ? {
                  rowIndex: pixel.rowIndex,
                  columnIndex: pixel.columnIndex,
                  shapeId: pixel.shape?.id || null,
                  disabled: pixel.disabled || false,
                }
              : null
          )
        : []
    );

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(historyData);

      const maxHistorySize = 50;
      if (newHistory.length > maxHistorySize) {
        const trimmedHistory = newHistory.slice(-maxHistorySize);
        setHistoryIndex(trimmedHistory.length - 1);
        return trimmedHistory;
      }

      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  },
  [historyIndex, isApplyingHistory]
);
```

#### After: 선언적 히스토리 관리

```typescript
// ✅ 명확하고 재사용 가능한 히스토리 유틸리티
const createHistoryEntry = (pixels) => convertPixelsToHistory(pixels);

const addToHistory = (currentHistory, historyIndex, newEntry) => {
  const newHistory = currentHistory.slice(0, historyIndex + 1);
  newHistory.push(newEntry);
  const { trimmedHistory, newIndex } = trimHistoryIfNeeded(newHistory);
  return { newHistory: trimmedHistory, newIndex };
};

// 사용하는 곳에서는 의도가 명확
const saveToHistory = useCallback(
  (newPixels) => {
    if (isApplyingHistory) return;

    const historyEntry = createHistoryEntry(newPixels);
    const { newHistory, newIndex } = addToHistory(
      history,
      historyIndex,
      historyEntry
    );

    setHistory(newHistory);
    setHistoryIndex(newIndex);
  },
  [history, historyIndex, isApplyingHistory]
);
```

---

## 📈 개선 효과

### 1. 즉각적인 버그 해결

```typescript
// ✅ 모든 브러시 도구에서 일관된 비활성화 셀 체크
const handleMouseMove = useCallback(
  () => {
    // DOT 브러시
    if (brushTool === BrushTool.DOT) {
      if (
        lastDrawnPos &&
        (lastDrawnPos.row !== row || lastDrawnPos.col !== col)
      ) {
        const linePixels = interpolatePixels(/* ... */);
        const drawablePixels = filterDrawablePixels(
          linePixels,
          rows,
          cols,
          pixels
        ); // ✅ 체크!
        // ...
      }
    }

    // LINE 브러시 미리보기
    if (brushTool === BrushTool.LINE && lineStart) {
      const linePixels = drawLine(/* ... */);
      const drawableLinePixels = filterDrawablePixels(
        linePixels,
        rows,
        cols,
        pixels
      ); // ✅ 체크!
      setPreviewLine(drawableLinePixels);
    }
  },
  [
    /* deps */
  ]
);
```

### 2. 코드 가독성 향상

```typescript
// ❌ Before: 무엇을 하는지 파악하기 어려움
if (row >= 0 && row < rows && col >= 0 && col < cols) {
  const existingPixel = newPixels[row]?.[col];
  if (!existingPixel?.disabled) {
    /* ... */
  }
}

// ✅ After: 의도가 명확함
if (canDrawOnCell(row, col, rows, cols, pixels)) {
  applyPixelWithDisabledCheck(newPixels, row, col, shape, rows, cols);
}
```

### 3. 유지보수성 개선

- **단일 진실 공급원**: 비활성화 셀 체크 로직이 한 곳에만 있음
- **변경 용이성**: 새로운 요구사항(예: 특정 조건에서만 그리기 금지) 추가 시 `canDrawOnCell` 함수만 수정
- **테스트 가능**: 각 유틸리티 함수를 독립적으로 테스트 가능

### 4. 확장성 확보

```typescript
// 새로운 요구사항: 특정 패턴에서는 그리기 금지
const canDrawOnCell = (row, col, rows, cols, pixels, specialPattern = null) => {
  if (!isValidPosition(row, col, rows, cols)) return false;
  if (isCellDisabled(row, col, pixels)) return false;
  if (specialPattern && isInForbiddenPattern(row, col, specialPattern))
    return false; // ✅ 쉽게 추가
  return true;
};
```

---

## 🎉 결론

### 핵심 성과

1. **버그 해결**: 비활성화 셀이 모든 브러시 도구에서 일관되게 차단됨
2. **코드 품질 향상**: 선언적 함수명으로 코드의 의도가 명확해짐
3. **유지보수성 개선**: 중복 로직 제거로 수정 시 한 곳만 변경하면 됨
4. **확장성 확보**: 새로운 검증 로직 추가가 용이함

### 배운 교훈

**선언적 프로그래밍의 핵심**:

- 함수명이 곧 문서화
- 작은 함수들의 조합으로 복잡한 로직 표현
- "무엇을 할 것인가"에 집중하여 가독성 향상

이 리팩토링을 통해 픽셀 아트 에디터는 단순한 버그 수정을 넘어서 **지속 가능한 코드베이스**로 발전했습니다. 🚀
