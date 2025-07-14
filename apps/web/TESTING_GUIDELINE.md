# Dotting 컴포넌트 테스팅 가이드라인

## 1. 테스팅 목표

- Dotting의 **핵심 로직**(픽셀 상태, 히스토리, 유틸 함수 등)과  
  **UI 상호작용**(마우스 드로잉, 선택, 복사/붙여넣기, Undo/Redo 등)을 신뢰성 있게 검증한다.
- **시각적 결과**(캔버스 렌더링)까지 자동화 테스트로 커버한다.

---

## 2. 테스팅 도구 및 환경

- **단위/통합 테스트**:

  - [Vitest](https://vitest.dev/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  - [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event/)

- **E2E/시각적 테스트**:
  - [Playwright](https://playwright.dev/)
  - (선택) [Storybook Test Runner](https://storybook.js.org/docs/writing-tests/test-runner) + Playwright

---

## 3. 테스트 설계 원칙

### 3.1. 단위 테스트

- **Pure function**(예: interpolatePixels, flipPixelsHorizontal 등)은 입력/출력만 검증
- **픽셀 데이터, 히스토리 관리** 등 내부 상태 변화는 mock/ref로 직접 확인

### 3.2. 통합 테스트

- **마우스 이벤트**(mousedown, mousemove, mouseup 등)로 실제 유저 액션을 시뮬레이션
- **ref 메서드**(getPixels, undo, redo 등)로 내부 상태를 검증
- **exportImage()** 등으로 시각적 결과를 base64로 비교(필요시)

### 3.3. E2E/시각적 테스트

- **실제 브라우저**에서 마우스 드래그, 복사/붙여넣기, Undo/Redo 등 전체 플로우 테스트
- **캔버스 스크린샷**을 저장/비교하여 시각적 회귀 방지

---

## 4. 테스트 케이스 설계

### 4.1. 단위 테스트 (Vitest)

- [ ] interpolatePixels, flipPixelsHorizontal 등 유틸 함수의 입력/출력 검증
- [ ] applyPixelWithDisabledCheck, canDrawOnCell 등 픽셀 상태 변화 검증
- [ ] 히스토리 관련 함수(undo, redo, addToHistory 등) 동작 검증

### 4.2. 통합 테스트 (Vitest + React Testing Library)

- [ ] Dotting 렌더링 및 ref 메서드 동작 확인
- [ ] 마우스 드래그로 픽셀 그리기/지우기
- [ ] 선택 영역 지정 및 복사/붙여넣기
- [ ] Undo/Redo 동작
- [ ] 비활성화 셀에 그릴 수 없는지 확인
- [ ] exportImage() 결과가 정상적으로 생성되는지 확인

### 4.3. E2E/시각적 테스트 (Playwright)

- [ ] Dotting 페이지 진입 및 캔버스 렌더링 확인
- [ ] 마우스 드래그로 도형 그리기 → 스크린샷 비교
- [ ] 선택/복사/붙여넣기/Undo/Redo 등 실제 유저 플로우 테스트
- [ ] 다양한 해상도/브라우저에서 시각적 결과 일관성 확인

---

## 5. 테스트 코드 예시

### 5.1. 단위 테스트 예시

```ts
import { interpolatePixels } from "./Dotting";

test("interpolatePixels는 올바른 픽셀 배열을 반환한다", () => {
  const result = interpolatePixels(0, 0, 2, 2, null);
  expect(result).toHaveLength(3); // 대각선 3개 픽셀
});
```

### 5.2. 통합 테스트 예시

```tsx
import { render, fireEvent } from "@testing-library/react";
import { Dotting } from "./Dotting";
import React from "react";

test("마우스 드래그로 픽셀을 그릴 수 있다", () => {
  const ref = React.createRef<any>();
  const { getByRole } = render(<Dotting ref={ref} rows={5} cols={5} />);
  const canvas =
    getByRole("img") || getByRole("presentation") || getByRole("canvas");

  fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });
  fireEvent.mouseMove(canvas, { clientX: 50, clientY: 30 });
  fireEvent.mouseUp(canvas);

  const pixels = ref.current?.getPixels();
  expect(pixels).toBeDefined();
  // ...픽셀 값 검증
});
```

### 5.3. E2E 테스트 예시

```ts
import { test, expect } from "@playwright/test";

test("Dotting에서 드로잉 후 캔버스 이미지가 바뀐다", async ({ page }) => {
  await page.goto("/project/edit/1");
  const canvas = await page.locator("canvas").first();

  await canvas.hover();
  await canvas.dispatchEvent("mousedown", { clientX: 30, clientY: 30 });
  await canvas.dispatchEvent("mousemove", { clientX: 60, clientY: 60 });
  await canvas.dispatchEvent("mouseup");

  expect(await canvas.screenshot()).toMatchSnapshot("dotting-after-draw.png");
});
```

---

## 6. 테스트 작성/운영 프로세스

1. **단위 테스트**부터 작성 (유틸 함수, 내부 로직)
2. **통합 테스트**로 주요 상호작용/상태 변화 검증
3. **E2E/시각적 테스트**로 실제 브라우저 환경에서 전체 플로우 및 시각적 결과 검증
4. PR/배포 시 자동화 테스트 통과 필수
5. 신규 기능/버그 수정 시 테스트 케이스 추가

---

## 7. 참고

- [Vitest 공식문서](https://vitest.dev/)
- [React Testing Library 공식문서](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 공식문서](https://playwright.dev/)
- [Storybook Test Runner](https://storybook.js.org/docs/writing-tests/test-runner)

---

**이 가이드라인을 따라 차근차근 테스트 환경을 구축하고, Dotting 컴포넌트의 신뢰성을 높여주세요!**  
추가로 궁금한 점이나 세부 예시가 필요하면 언제든 말씀해 주세요.
