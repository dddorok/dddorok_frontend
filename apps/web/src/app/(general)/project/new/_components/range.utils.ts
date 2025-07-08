import { ChartValueType } from "@/constants/chart.constants";
import { SvgMappingControlType } from "@/services/template";

interface MeasurementItemType {
  code: string;
  label: string;
  value: number;
  min: number;
  max: number;
  range_toggle: boolean;
  value_type: ChartValueType;
}

export interface CalculationResult {
  code: string;
  label: string;
  average: number;
  control: string;
  originalControl: string;
  initialValue: number;
  max: number;
  min: number;
  value_type: ChartValueType;
  isPartialControl: boolean;
  originalValue: number;
  originalAverage: number;
  originalInitialValue: number;
  originalMin: number;
  originalMax: number;
  baseMinRange: number;
  baseMaxRange: number;
  gapValue: number;
}

interface AllocatedRange {
  code: string;
  range: string;
  value: number;
}

// 범위 크기 계산 함수 (row/col 기반)
const getRangeSize = (range: string): number => {
  const [start, end] = range.split("-");

  if (!start || !end) return 1;

  // 숫자 범위 (col)
  if (!isNaN(Number(start)) && !isNaN(Number(end))) {
    return Math.abs(parseInt(end) - parseInt(start)) + 1;
  }

  // 문자 범위 (row)
  if (start.length === 1 && end.length === 1) {
    return Math.abs(end.charCodeAt(0) - start.charCodeAt(0)) + 1;
  }

  return 1;
};

// 범위가 겹치는지 확인하는 함수 (간격 기반)
const isRangeOverlapping = (range1: string, range2: string): boolean => {
  const [r1Start, r1End] = range1.split("-");
  const [r2Start, r2End] = range2.split("-");

  if (!r1Start || !r1End || !r2Start || !r2End) return false;

  // 숫자 범위 (col) 비교 - 간격이 겹치는지 확인
  if (
    !isNaN(Number(r1Start)) &&
    !isNaN(Number(r1End)) &&
    !isNaN(Number(r2Start)) &&
    !isNaN(Number(r2End))
  ) {
    const r1S = parseInt(r1Start);
    const r1E = parseInt(r1End);
    const r2S = parseInt(r2Start);
    const r2E = parseInt(r2End);

    // 간격이 실제로 겹치는지 확인 (접촉점만 공유하는 것은 겹치지 않음)
    return !(r1E <= r2S || r2E <= r1S);
  }

  // 문자 범위 (row) 비교 - 간격이 겹치는지 확인
  if (
    r1Start.length === 1 &&
    r1End.length === 1 &&
    r2Start.length === 1 &&
    r2End.length === 1
  ) {
    const r1S = r1Start.charCodeAt(0);
    const r1E = r1End.charCodeAt(0);
    const r2S = r2Start.charCodeAt(0);
    const r2E = r2End.charCodeAt(0);

    // 간격이 실제로 겹치는지 확인 (접촉점만 공유하는 것은 겹치지 않음)
    return !(r1E <= r2S || r2E <= r1S);
  }

  return false;
};

export const getRangeData = ({
  controlData,
  valueData,
}: {
  controlData: SvgMappingControlType[];
  valueData: [string, MeasurementItemType][];
}) => {
  // 계산 결과 (useMemo로 최적화)
  const results = () => {
    const valueMap = new Map<string, MeasurementItemType>(valueData);

    // 1. 범위 크기 순으로 정렬 (작은 것부터)
    const sortedControls = [...controlData].sort((a, b) => {
      const sizeA = getRangeSize(a.original_control);
      const sizeB = getRangeSize(b.original_control);
      return sizeA - sizeB;
    });

    const allocatedRanges: AllocatedRange[] = [];
    const calculated: CalculationResult[] = [];

    sortedControls.forEach((control) => {
      const valueInfo = valueMap.get(control.code);
      if (!valueInfo) return;

      const originalRange = control.original_control;
      let overlappingValues = 0;

      // 이미 할당된 범위와 겹치는 부분 계산
      const overlappingControls: string[] = [];
      allocatedRanges.forEach((allocated) => {
        if (isRangeOverlapping(originalRange, allocated.range)) {
          overlappingControls.push(allocated.code);
          overlappingValues += allocated.value;
        }
      });

      // 실제 조정 가능한 값 계산
      const adjustedAverage = valueInfo.value - overlappingValues;

      // 현재 컨트롤의 실제 범위 (control 필드 사용)
      const actualRange = control.control;

      // 할당된 범위에 추가
      allocatedRanges.push({
        code: control.code,
        range: actualRange,
        value: adjustedAverage,
      });

      const baseMin = valueInfo.min;
      const baseMax = valueInfo.max;
      const minValue = adjustedAverage - baseMin;
      const maxValue = adjustedAverage + baseMax;

      calculated.push({
        code: control.code,
        label: control.label,
        average: adjustedAverage,
        control: actualRange,
        originalControl: originalRange,
        initialValue: valueInfo.value,
        max: maxValue,
        min: minValue,
        value_type: valueInfo.value_type,
        isPartialControl: actualRange !== originalRange,
        originalValue: valueInfo.value,
        originalAverage: valueInfo.value,
        originalInitialValue: valueInfo.value,
        originalMin: valueInfo.value - baseMin,
        originalMax: valueInfo.value + baseMax,
        baseMinRange: baseMin,
        baseMaxRange: baseMax,
        // overlappingControls: overlappingControls,
        // rangeSize: getRangeSize(actualRange),
        // originalRangeSize: getRangeSize(originalRange),
        gapValue: valueInfo.value - adjustedAverage,
      });
    });

    return calculated;
  };

  return results();
};

export const getSnapValues = (
  min: number,
  max: number,
  snapGap: number = 0.5
) => {
  const snapValues = [];
  for (let i = min; i <= max; i += snapGap) {
    snapValues.push(i);
  }
  return snapValues;
};
