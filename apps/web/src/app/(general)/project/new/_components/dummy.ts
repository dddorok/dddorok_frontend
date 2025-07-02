export interface MeasurementDummyData {
  code: string;
  label: string;
  average: number;
  control: string;
  originalControl: string;
  initialValue: number;
  max: number;
  min: number;
  snapValues: number[];
  value_type: "WIDTH" | "LENGTH";
  isPartialControl: boolean;
  originalValue: number;
  originalAverage: number;
  originalInitialValue: number;
  originalMin: number;
  originalMax: number;
  baseMinRange: number;
  baseMaxRange: number;
  gapValue: number; // origin 데이터와의 차이
}
// BODY_CHEST_WIDTH, BODY_BACK_NECK_LENGTH, BODY_SHOULDER_SLOPE_LENGTH
export const NO_CONTROL_DATA = [
  {
    code: "BODY_BACK_NECK_WIDTH",
    label: "가슴 너비",
    value: 18,
    min: 3,
    max: 5,
  },
];

export const BODY_DUMMY_DATA: MeasurementDummyData[] = [
  {
    code: "BODY_SHOULDER_WIDTH",
    label: "어깨 너비",
    average: 6,
    control: "2-3",
    originalControl: "1-3",
    initialValue: 6,
    max: 11,
    min: 3,
    snapValues: [
      3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11,
    ],
    value_type: "WIDTH",
    isPartialControl: true,
    originalValue: 21,
    originalAverage: 21,
    originalInitialValue: 21,
    originalMin: 18,
    originalMax: 26,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 15,
  },
  {
    code: "BODY_BACK_NECK_WIDTH",
    label: "뒷목 너비",
    average: 15,
    control: "1-2",
    originalControl: "1-2",
    initialValue: 15,
    max: 20,
    min: 12,
    snapValues: [
      12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19,
      19.5, 20,
    ],
    value_type: "WIDTH",
    isPartialControl: false,
    originalValue: 15,
    originalAverage: 15,
    originalInitialValue: 15,
    originalMin: 12,
    originalMax: 20,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
  {
    code: "BODY_FRONT_NECK_LENGTH",
    label: "앞목 길이",
    average: 5.5,
    control: "a-b",
    originalControl: "a-b",
    initialValue: 5.5,
    max: 10.5,
    min: 2.5,
    snapValues: [
      2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5,
    ],
    value_type: "LENGTH",
    isPartialControl: false,
    originalValue: 5.5,
    originalAverage: 5.5,
    originalInitialValue: 5.5,
    originalMin: 2.5,
    originalMax: 10.5,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
  {
    code: "BODY_WAIST_LENGTH",
    label: "허리 길이",
    average: 24,
    control: "c-d",
    originalControl: "c-d",
    initialValue: 24,
    max: 29,
    min: 21,
    snapValues: [
      21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28,
      28.5, 29,
    ],
    value_type: "LENGTH",
    isPartialControl: false,
    originalValue: 24,
    originalAverage: 24,
    originalInitialValue: 24,
    originalMin: 21,
    originalMax: 29,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
  {
    code: "BODY_HEM_WIDTH",
    label: "밑단 너비",
    average: 11,
    control: "3-4",
    originalControl: "1-4",
    initialValue: 11,
    max: 16,
    min: 8,
    snapValues: [
      8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15,
      15.5, 16,
    ],
    value_type: "WIDTH",
    isPartialControl: true,
    originalValue: 32,
    originalAverage: 32,
    originalInitialValue: 32,
    originalMin: 29,
    originalMax: 37,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 21,
  },
  {
    code: "BODY_ARMHOLE_LENGTH",
    label: "진동 길이",
    average: 13,
    control: "b-c",
    originalControl: "b-c",
    initialValue: 13,
    max: 18,
    min: 10,
    snapValues: [
      10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17,
      17.5, 18,
    ],
    value_type: "LENGTH",
    isPartialControl: false,
    originalValue: 13,
    originalAverage: 13,
    originalInitialValue: 13,
    originalMin: 10,
    originalMax: 18,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
];

export const SLEEVE_DUMMY_DATA: MeasurementDummyData[] = [
  {
    code: "SLEEVE_TOTAL_WIDTH",
    label: "소매 너비",
    average: 6,
    control: "2-3",
    originalControl: "1-3",
    initialValue: 6,
    max: 11,
    min: 3,
    snapValues: [
      3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11,
    ],
    value_type: "WIDTH",
    isPartialControl: true,
    originalValue: 12,
    originalAverage: 12,
    originalInitialValue: 12,
    originalMin: 9,
    originalMax: 17,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 6,
  },
  {
    code: "SLEEVE_LOWER_SLEEVE_LENGTH",
    label: "소매 하단 길이",
    average: 18,
    control: "b-c",
    originalControl: "b-c",
    initialValue: 18,
    max: 23,
    min: 15,
    snapValues: [
      15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22,
      22.5, 23,
    ],
    value_type: "LENGTH",
    isPartialControl: false,
    originalValue: 18,
    originalAverage: 18,
    originalInitialValue: 18,
    originalMin: 15,
    originalMax: 23,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
  {
    code: "SLEEVE_HEM_WIDTH",
    label: "소매 밑단 너비",
    average: 6,
    control: "1-2",
    originalControl: "1-2",
    initialValue: 6,
    max: 11,
    min: 3,
    snapValues: [
      3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11,
    ],
    value_type: "WIDTH",
    isPartialControl: false,
    originalValue: 6,
    originalAverage: 6,
    originalInitialValue: 6,
    originalMin: 3,
    originalMax: 11,
    baseMinRange: 3,
    baseMaxRange: 5,
    gapValue: 0,
  },
];
