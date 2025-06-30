# SVG 2D 그리드 조정 기능 리팩토링 및 문제 해결 문서

## 0. 요구사항 및 설계 원칙 (초기 요구 포함)

### 0.1 요구 배경 및 목적

- 패턴/의류 설계, CAD 등에서 SVG 기반의 2D 그리드(격자) 구조를 사용하여 각 구간(거리, 길이 등)을 조정할 수 있어야 함
- 사용자는 각 구간의 값을 슬라이더 등으로 조정하며, 이때 SVG가 실제 패턴의 변형처럼 자연스럽게 늘어나거나 줄어드는 경험을 원함

### 0.2 데이터와 조정 방식의 정의

- **average**: 각 구간(예: a1-a2, b1-b2 등)의 평균값(기준값, 표준치)
- **min/max**: 사용자가 조정할 수 있는 해당 구간의 최소/최대값(허용 범위)
- **초기 SVG**: average 값 기준으로 그려진 SVG(즉, 모든 구간이 average일 때의 모습)
- **조정값**: 사용자가 슬라이더 등으로 입력한 값(average~min/max 범위 내)
- **비율 적용**: (현재값 / average) 비율만큼 해당 구간의 길이(거리)를 스케일링

### 0.3 2D 그리드에서의 control 적용 방식

- 각 Point의 id는 행(row)과 열(col)로 구성됨(예: a1, b2)
- control(예: "1-2", "a-b")는 2D 그리드 전체에 대해 적용됨
  - "1-2": 모든 행의 1-2 간격(a1-a2, b1-b2, ...)을 동시에 조정
  - "a-b": 모든 열의 a-b 간격(a1-b1, a2-b2, ...)을 동시에 조정
- 여러 control이 한 점을 공유할 때는, 각 control의 영향을 순차적으로 누적 적용(실제 패턴 설계와 동일)

### 0.4 사용자 경험 및 기대 효과

- **초기 상태**(average)는 SVG 원본과 100% 일치(패턴의 기준치와 동일)
- 사용자가 슬라이더로 값을 조정하면, 해당 구간만 자연스럽게 비율로 변형됨(실제 패턴 조정과 동일한 직관적 경험)
- min/max 범위 내에서만 조정 가능하므로, 비정상적/비현실적 변형이 발생하지 않음
- 여러 구간을 동시에 조정해도, 전체 SVG가 자연스럽게 연동되어 변형됨

### 0.5 설계/구현 원칙

- average/min/max/비율 적용 등 실제 패턴 설계의 원리를 그대로 반영
- 2D 그리드 구조의 일반성(행/열 확장성) 보장
- 타입 안정성, linter 에러 방지, 유지보수성까지 모두 고려

## 1. 기존 문제점 및 요구사항

- 기존 코드는 1D anchor-누적 이동 방식으로, control(예: "1-2")이 한 쌍의 점에만 적용됨
- 실제 SVG/패턴 설계에서는 2D 그리드(행/열) 구조에서 control이 전체 행/열에 동시에 적용되어야 함
- 예: control "1-2"는 a1-a2, b1-b2, ... 등 모든 행의 1-2 간격에 적용
- 슬라이더 조정 시 SVG가 자연스럽게 변형되어야 하며, 초기 상태는 SVG 원본과 100% 일치해야 함

## 2. 리팩토링 및 개선 방향

### 2.1 2D 그리드 구조로 확장

- Point의 id에서 행(row), 열(col) 정보를 추출 (예: a1, b2)
- initialPoints를 2D gridMap[row][col] 구조로 변환
- rows, cols를 각각 정렬하여 전체 그리드 순회 가능하게 함

### 2.2 control별 전체 행/열 적용

- X축(열) control(예: "1-2")은 모든 행의 해당 열 쌍(a1-a2, b1-b2, ...)에 비율 적용
- Y축(행) control(예: "a-b")은 모든 열의 해당 행 쌍(a1-b1, a2-b2, ...)에 비율 적용
- 각 control별로 gridAdjustments의 값을 곱해 점 위치를 이동

### 2.3 타입/안전성 개선

- 모든 gridMap[row][col] 접근 전에 if문으로 존재 여부를 체크하여 linter 에러 방지
- 옵셔널 체이닝 대신 명확한 if문 분기로 타입 안정성 확보

### 2.4 실제 적용 방식

- getAdjustedPoints 함수에서 위 로직을 구현
- AdjustmentProvider/useAdjuestment 등에서 controls(sliderData.map(s => s.control))를 넘김
- adjustedPoints가 SVG 렌더링에 사용되어 슬라이더 조정 시 SVG가 자연스럽게 변형됨

## 3. 주요 코드 스니펫

```typescript
// 2D 그리드 변환 및 control별 전체 행/열 적용
for (let c = 0; c < cols.length - 1; c++) {
  const control = `${cols[c]}-${cols[c + 1]}`;
  const ratio = gridAdjustments[control] ?? 1;
  for (const row of rows) {
    if (!gridMap[row]) continue;
    if (!gridMap[row][cols[c]]) continue;
    if (!gridMap[row][cols[c + 1]]) continue;
    const p1 = gridMap[row][cols[c]];
    const p2 = gridMap[row][cols[c + 1]];
    if (!p1 || !p2) continue;
    // ... (비율 적용)
  }
}
```

## 4. 결과 및 효과

- 슬라이더 조정 시 SVG가 실제 2D 그리드 구조에 맞게 자연스럽게 변형됨
- 초기 상태는 SVG 원본과 100% 일치
- 타입스크립트 linter 에러 없이 안전하게 동작

---

**이 문서는 2024-06 기준 SVG 2D 그리드 조정 기능 리팩토링 및 문제 해결 과정을 기록한 문서입니다.**
