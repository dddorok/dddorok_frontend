# 픽셀 아트 에디터 개선 요약

## 🎯 전체 개선 과정

### 1차 개선: SVG → Canvas 렌더링 전환

**문제**: SVG의 비동기 렌더링으로 인한 순차적 도형 표시와 성능 저하  
**해결**: Shape 인터페이스에 `render` 함수를 추가하여 Canvas 렌더링 함수 직접 전달  
**결과**: 동기 Canvas 렌더링으로 성능 대폭 개선

### 2차 개선: Props 구조 변경

**변경**: `width`, `height` props → `rows`, `cols` 개수 기반 자동 계산  
**장점**: 그리드 칸수로 직관적인 크기 설정 가능

### 3차 개선: Undo/Redo 기능 추가

- 최대 50개 상태 저장하는 히스토리 시스템
- `DottingRef` 인터페이스에 undo/redo 메서드 추가
- 키보드 단축키 지원 (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)

### 4차 개선: 비활성화 셀과 초기 데이터 기능

- `disabled` 속성을 통한 비활성화 셀 지원
- `initialCells` props로 초기 선택된 셀 데이터 설정
- 비활성화된 셀에는 모든 편집 작업 차단

### 5차 개선: 선언적 프로그래밍으로 리팩토링

**목적**: 코드 가독성과 유지보수성 향상  
**결과**: 비즈니스 로직이 함수명으로 명확히 표현되는 선언적 코드

---

## 🔧 핵심 선언적 유틸리티 함수들

### 비활성화 셀 관련 함수들

```typescript
// 위치 유효성 검사
const isValidPosition = (
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean

// 셀 비활성화 상태 확인
const isCellDisabled = (
  row: number,
  col: number,
  pixels: (Pixel | null)[][]
): boolean

// 셀에 그리기 가능 여부 확인
const canDrawOnCell = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  pixels: (Pixel | null)[][]
): boolean

// 그리기 가능한 픽셀만 필터링
const filterDrawablePixels = (
  pixelsToFilter: Pixel[],
  rows: number,
  cols: number,
  currentPixels: (Pixel | null)[][]
): Pixel[]

// 비활성화 체크와 함께 픽셀 적용
const applyPixelWithDisabledCheck = (
  newPixels: (Pixel | null)[][],
  row: number,
  col: number,
  shape: Shape | null,
  rows: number,
  cols: number
): void
```

### 히스토리 관련 함수들

#### 데이터 변환 함수들

```typescript
// 단일 픽셀 변환
const convertPixelToHistory = (pixel: Pixel): HistoryPixel
const convertHistoryToPixel = (
  historyPixel: HistoryPixel,
  getShapeById: (id: string | null) => Shape | null
): Pixel

// 전체 픽셀 배열 변환
const convertPixelsToHistory = (
  pixels: (Pixel | null)[][]
): (HistoryPixel | null)[][]
const convertHistoryToPixels = (
  historyPixels: (HistoryPixel | null)[][],
  getShapeById: (id: string | null) => Shape | null
): (Pixel | null)[][]
```

#### 히스토리 관리 함수들

```typescript
// 히스토리 엔트리 생성
const createHistoryEntry = (
  pixels: (Pixel | null)[][]
): (HistoryPixel | null)[][]

// 히스토리 크기 제한
const trimHistoryIfNeeded = (
  history: (HistoryPixel | null)[][][],
  maxSize: number = 50
): { trimmedHistory: (HistoryPixel | null)[][][], newIndex: number }

// 히스토리에 새 엔트리 추가
const addToHistory = (
  currentHistory: (HistoryPixel | null)[][][],
  historyIndex: number,
  newEntry: (HistoryPixel | null)[][]
): { newHistory: (HistoryPixel | null)[][][], newIndex: number }

// 히스토리 초기화
const initializeHistory = (
  initialPixels: (Pixel | null)[][]
): (HistoryPixel | null)[][][]
```

#### Undo/Redo 실행 함수들

```typescript
// Undo/Redo 가능 여부 확인
const canUndoHistory = (historyIndex: number): boolean
const canRedoHistory = (historyIndex: number, historyLength: number): boolean

// Undo/Redo 실행
const executeUndo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => Shape | null
): { pixels: (Pixel | null)[][], newIndex: number } | null

const executeRedo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => Shape | null
): { pixels: (Pixel | null)[][], newIndex: number } | null
```

---

## 🔄 Before vs After 비교

### Before (절차적 코드)

```typescript
// 복잡한 조건문과 반복 로직
if (row >= 0 && row < rows && col >= 0 && col < cols) {
  const existingPixel = newPixels[row]?.[col];
  if (!existingPixel?.disabled) {
    // 복잡한 그리기 로직...
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

// 히스토리 관리 로직 복잡함
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
```

### After (선언적 코드)

```typescript
// 의도가 명확한 함수명
if (canDrawOnCell(row, col, rows, cols, pixels)) {
  applyPixelWithDisabledCheck(newPixels, row, col, shape, rows, cols);
}

// 라인 그리기에서 비활성화 셀 자동 필터링
const drawablePixels = filterDrawablePixels(linePixels, rows, cols, pixels);

// 히스토리 관리 로직 단순화
const { newHistory, newIndex } = addToHistory(prev, historyIndex, historyEntry);
setHistoryIndex(newIndex);
return newHistory;

// Undo/Redo 실행 로직 단순화
const result = executeUndo(history, historyIndex, getShapeById);
if (result) {
  setIsApplyingHistory(true);
  setPixels(result.pixels);
  setHistoryIndex(result.newIndex);
  setTimeout(() => setIsApplyingHistory(false), 0);
}
```

---

## 📈 개선 효과

### 1. 🔍 **가독성 향상**

- "비활성화된 셀에는 그리기 차단"이라는 비즈니스 로직이 함수명으로 명확히 드러남
- `canDrawOnCell()`, `filterDrawablePixels()` 등 의도를 명확히 표현하는 함수명

### 2. 🔄 **재사용성 증대**

- 동일한 로직이 여러 곳에서 일관되게 사용됨
- 비활성화 셀 체크 로직이 DOT, ERASER, LINE 브러시 모두에서 공통 적용

### 3. 🛡️ **유지보수성 개선**

- 로직 변경 시 함수 하나만 수정하면 모든 곳에 적용됨
- 히스토리 관련 버그 수정이 한 곳에서 가능

### 4. 🧪 **테스트 용이성**

- 각 함수를 독립적으로 테스트 가능
- 단위 테스트 작성이 용이함

### 5. 📖 **자기 문서화**

- 함수명 자체가 코드의 의도를 설명
- 주석 없이도 코드의 목적을 이해 가능

---

## 🚀 현재 지원 기능

### 🎨 **브러시 도구**

- `DOT`: 점 그리기
- `ERASER`: 지우개
- `LINE`: 직선 그리기
- `SELECT`: 영역 선택
- `NONE`: 팬/줌 모드

### 🧶 **뜨개질 기호** (8가지)

- 뜨기, 날리기, 걸기
- 왼쪽줄임, 오른쪽줄임
- 케이블교차, 빼기, 봉긋

### ⚙️ **고급 기능**

- ✅ Undo/Redo (최대 50단계)
- ✅ 키보드 단축키 지원
- ✅ 확대/축소/팬 기능
- ✅ 비활성화 셀 지원
- ✅ 초기 데이터 설정
- ✅ Canvas 기반 고성능 렌더링

### 🔧 **개발자 친화적 API**

```typescript
interface DottingRef {
  clear: () => void;
  getPixels: () => (Pixel | null)[][];
  setPixels: (newPixels: (Pixel | null)[][]) => void;
  exportImage: () => string;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}
```

---

## 📝 사용 예시

```typescript
// 기본 사용법
<Dotting
  rows={10}
  cols={10}
  gridSquareLength={30}
  brushTool={BrushTool.DOT}
  selectedShape={KNITTING_SYMBOLS[0]}
  ref={dottingRef}
/>

// 초기 데이터와 비활성화 셀 설정
<Dotting
  rows={5}
  cols={4}
  initialCells={[
    { row: 1, col: 1, shape: KNITTING_SYMBOLS[0] }, // 뜨기
    { row: 2, col: 2, shape: KNITTING_SYMBOLS[1] }  // 날리기
  ]}
  disabledCells={[
    { row: 0, col: 0 },
    { row: 0, col: 3 },
    { row: 4, col: 0 },
    { row: 4, col: 3 }
  ]}
  disabledCellColor="#f0f0f0"
/>
```

---

## 🎉 결론

픽셀 아트 에디터는 **성능**, **사용성**, **기능**, **코드 품질** 모든 면에서 크게 개선되었습니다.

특히 **선언적 프로그래밍 패러다임**을 도입하여 코드의 **가독성**과 **유지보수성**이 대폭 향상되었으며, 뜨개질 패턴 편집기로서 필요한 모든 핵심 기능을 완비한 완성도 높은 컴포넌트가 되었습니다.
