# React + SVG + 슬라이더 테스트 가이드

이 문서는 이 프로젝트(Next.js + React + TypeScript)에서 SVG 렌더링, 슬라이더 조정, path/포인트 변화, 상호작용을 테스트하는 방법을 정리한 가이드입니다.

---

## 1. 추천 테스팅 스택

- **React Testing Library**: 사용자 관점의 DOM 테스트
- **Jest**: 테스트 러너 및 assertion, 모킹 등
- (Next.js라면) `@testing-library/user-event`도 함께 사용

---

## 2. 설치 방법

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm install --save-dev @testing-library/user-event # (Next.js라면)
```

---

## 3. 설정 (Jest)

- Next.js라면 `next/jest`로 설정하거나, 일반 CRA/React라면 기본 jest.config.js 사용
- `jest.setup.js`에 아래 추가:

```js
import "@testing-library/jest-dom";
```

---

## 4. SVG/슬라이더/렌더링 테스트 샘플

### 4.1 SVG 렌더링 테스트

```tsx
import { render, screen } from "@testing-library/react";
import SvgPreview from "../path/to/SvgPreview";

const mockProps = {
  svgContent: "<svg>...</svg>",
  paths: [
    /* ... */
  ],
  points: [
    /* ... */
  ],
  onPointClick: jest.fn(),
  highlightedPathId: null,
  svgDimensions: { width: 100, height: 100, minX: 0, minY: 0 },
  xIntervals: [1, 1, 1],
  yIntervals: [1, 1, 1],
};

test("SVG와 path가 정상적으로 렌더링된다", () => {
  render(<SvgPreview {...mockProps} />);
  expect(document.querySelector("svg")).toBeInTheDocument();
  expect(document.querySelectorAll("path").length).toBeGreaterThan(0);
  expect(document.querySelectorAll("circle").length).toBeGreaterThan(0);
});
```

### 4.2 슬라이더 조정 → path/포인트 변화 테스트

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ChartRegistration from '../path/to/ChartRegistration';

test('슬라이더 조정 시 path와 포인트 위치가 변한다', () => {
  render(<ChartRegistration data={...} id="..." />);
  const xSlider = screen.getAllByRole('slider')[0];
  const path = document.querySelector('path');
  const dBefore = path?.getAttribute('d');
  fireEvent.change(xSlider, { target: { value: '1.5' } });
  const dAfter = path?.getAttribute('d');
  expect(dBefore).not.toBe(dAfter);
});
```

### 4.3 포인트 클릭 등 상호작용 테스트

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import SvgPreview from "../path/to/SvgPreview";

test("포인트 클릭 이벤트가 정상 동작한다", () => {
  const onPointClick = jest.fn();
  render(<SvgPreview {...mockProps} onPointClick={onPointClick} />);
  const point = document.querySelector("circle");
  if (point) fireEvent.click(point);
  expect(onPointClick).toHaveBeenCalled();
});
```

---

## 5. 팁 및 참고

- **접근성/aria**: getByRole, getByLabelText 등으로 접근성 테스트도 가능
- **시각적 변화(곡선의 부드러움 등)는 좌표/속성 변화로 간접 검증**
- **E2E(시각적 리그레션 등)는 Cypress 등으로 추가 가능**
- [React Testing Library 공식 문서](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)

---

## 6. 실제 적용 순서

1. 위 패키지 설치 및 jest 설정
2. `__tests__/` 폴더에 테스트 파일 생성 (예: SvgPreview.test.tsx)
3. 샘플 코드 참고하여 컴포넌트별 테스트 작성
4. `npm test` 또는 `yarn test`로 실행

---

## 7. E2E 테스트 & Cypress

### 7.1 Cypress란?

- 실제 브라우저에서 사용자의 행동을 시뮬레이션하여 전체 플로우를 테스트하는 E2E(End-to-End) 테스트 도구
- DOM, SVG, Canvas 등 실제 렌더링 결과와 상호작용을 자동화로 검증 가능
- 시각적 리그레션(픽셀 단위 변화 감지)도 플러그인으로 지원

### 7.2 설치 방법

```bash
npm install --save-dev cypress
```

### 7.3 기본 사용법

```bash
npx cypress open # GUI로 실행
npx cypress run  # CLI로 실행
```

- `cypress/e2e/` 폴더에 테스트 파일 생성 (예: svg.cy.ts)

### 7.4 SVG/슬라이더/상호작용 E2E 예시

```js
// cypress/e2e/svg.cy.ts

describe("SVG 렌더링 및 상호작용 E2E", () => {
  it("SVG가 정상적으로 렌더링된다", () => {
    cy.visit("/admin/chart-types/svg-mapping-new");
    cy.get("svg").should("exist");
    cy.get("path").should("have.length.greaterThan", 0);
    cy.get("circle").should("have.length.greaterThan", 0);
  });

  it("슬라이더 조정 시 path가 변한다", () => {
    cy.get("input[type=range]").first().invoke("val", 1.5).trigger("input");
    cy.get("path").then(($path) => {
      const dBefore = $path.attr("d");
      cy.get("input[type=range]").first().invoke("val", 1.8).trigger("input");
      cy.get("path").should(($path2) => {
        expect($path2.attr("d")).not.eq(dBefore);
      });
    });
  });

  it("포인트 클릭 시 이벤트 발생", () => {
    cy.get("circle").first().click();
    // 이후 발생하는 UI 변화나 네트워크 요청 등 검증
  });
});
```

### 7.5 시각적 리그레션(픽셀 변화 감지)

- [cypress-image-snapshot](https://github.com/jaredpalmer/cypress-image-snapshot) 등 플러그인으로 SVG/차트의 픽셀 단위 변화도 자동 비교 가능
- 예시:

```js
import "cypress-image-snapshot/command";

it("SVG가 이전과 동일하게 렌더링되는지 비교", () => {
  cy.get("svg").toMatchImageSnapshot();
});
```

### 7.6 참고 자료

- [Cypress 공식 문서](https://docs.cypress.io/)
- [Cypress로 SVG 테스트하기](https://docs.cypress.io/guides/references/best-practices#SVG)
- [cypress-image-snapshot](https://github.com/jaredpalmer/cypress-image-snapshot)

---

이 가이드만 있으면, 실제 SVG/슬라이더/렌더링/상호작용 테스트를 바로 시작할 수 있습니다!
