"use client";
import { Plus, Trash2, Save } from "lucide-react";
import React, { useState, useEffect } from "react";

interface MeasurementData {
  code: string;
  label: string;
  value: number;
  min: number;
  max: number;
  range_toggle: boolean;
  value_type: "WIDTH" | "LENGTH";
}

interface ManualItem {
  measurement_code: string;
  start_point_id: string;
  end_point_id: string;
  slider_default: boolean;
}

interface SliderConfig {
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
}

const SliderConfigManager: React.FC = () => {
  const measurements: [string, MeasurementData][] = [
    [
      "BODY_BACK_NECK_WIDTH",
      {
        code: "BODY_BACK_NECK_WIDTH",
        label: "뒷목 너비",
        value: 15,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "WIDTH",
      },
    ],
    [
      "BODY_SHOULDER_WIDTH",
      {
        code: "BODY_SHOULDER_WIDTH",
        label: "어깨 너비",
        value: 21,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "WIDTH",
      },
    ],
    [
      "SLEEVE_TOTAL_WIDTH",
      {
        code: "SLEEVE_TOTAL_WIDTH",
        label: "소매 너비",
        value: 12,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "WIDTH",
      },
    ],
    [
      "SLEEVE_HEM_WIDTH",
      {
        code: "SLEEVE_HEM_WIDTH",
        label: "소매 밑단 너비",
        value: 6,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "WIDTH",
      },
    ],
    [
      "BODY_CHEST_WIDTH",
      {
        code: "BODY_CHEST_WIDTH",
        label: "가슴 너비",
        value: 32,
        min: 0,
        max: 0,
        range_toggle: false,
        value_type: "WIDTH",
      },
    ],
    [
      "BODY_HEM_WIDTH",
      {
        code: "BODY_HEM_WIDTH",
        label: "밑단 너비",
        value: 32,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "WIDTH",
      },
    ],
    [
      "BODY_BACK_NECK_LENGTH",
      {
        code: "BODY_BACK_NECK_LENGTH",
        label: "뒷목 길이",
        value: 1.2,
        min: 0,
        max: 0,
        range_toggle: false,
        value_type: "LENGTH",
      },
    ],
    [
      "BODY_SHOULDER_SLOPE_LENGTH",
      {
        code: "BODY_SHOULDER_SLOPE_LENGTH",
        label: "어깨경사 길이",
        value: 1,
        min: 0,
        max: 0,
        range_toggle: false,
        value_type: "LENGTH",
      },
    ],
    [
      "BODY_FRONT_NECK_LENGTH",
      {
        code: "BODY_FRONT_NECK_LENGTH",
        label: "앞목 길이",
        value: 5.5,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "LENGTH",
      },
    ],
    [
      "BODY_ARMHOLE_LENGTH",
      {
        code: "BODY_ARMHOLE_LENGTH",
        label: "진동 길이",
        value: 13,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "LENGTH",
      },
    ],
    [
      "BODY_WAIST_LENGTH",
      {
        code: "BODY_WAIST_LENGTH",
        label: "허리 길이",
        value: 24,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "LENGTH",
      },
    ],
    [
      "SLEEVE_LOWER_SLEEVE_LENGTH",
      {
        code: "SLEEVE_LOWER_SLEEVE_LENGTH",
        label: "소매 하단 길이",
        value: 18,
        min: 3,
        max: 5,
        range_toggle: true,
        value_type: "LENGTH",
      },
    ],
  ];

  const manual: ManualItem[] = [
    {
      measurement_code: "SLEEVE_TOTAL_WIDTH",
      start_point_id: "b1",
      end_point_id: "b3",
      slider_default: true,
    },
    {
      measurement_code: "SLEEVE_SLEEVE_CAP_LENGTH",
      start_point_id: "a1",
      end_point_id: "b1",
      slider_default: false,
    },
    {
      measurement_code: "SLEEVE_LOWER_SLEEVE_LENGTH",
      start_point_id: "b1",
      end_point_id: "c1",
      slider_default: true,
    },
    {
      measurement_code: "SLEEVE_HEM_WIDTH",
      start_point_id: "c1",
      end_point_id: "c2",
      slider_default: true,
    },
  ];

  const [sliderConfigs, setSliderConfigs] = useState<SliderConfig[]>([]);

  // 유틸리티 함수들
  const generateControlString = (
    startPointId: string,
    endPointId: string,
    valueType: "WIDTH" | "LENGTH"
  ): string => {
    if (valueType === "WIDTH") {
      const startNum = startPointId.match(/\d+/)?.[0] || "";
      const endNum = endPointId.match(/\d+/)?.[0] || "";
      return `${startNum}-${endNum}`;
    } else {
      const startChar = startPointId.charAt(0);
      const endChar = endPointId.charAt(0);
      return `${startChar}-${endChar}`;
    }
  };

  const generateSnapValues = (min: number, max: number): number[] => {
    const snapValues: number[] = [];
    for (let i = min; i <= max; i += 0.5) {
      snapValues.push(parseFloat(i.toFixed(1)));
    }
    return snapValues;
  };

  // 초기 슬라이더 설정 생성
  useEffect(() => {
    const measurementMap = new Map(measurements);
    const sliderItems = manual.filter((item) => item.slider_default === true);

    // WIDTH 항목들을 원래 컨트롤 범위 크기 순으로 정렬
    const widthItems = sliderItems
      .filter(
        (item) =>
          measurementMap.get(item.measurement_code)?.value_type === "WIDTH"
      )
      .sort((a, b) => {
        const aControl = generateControlString(
          a.start_point_id,
          a.end_point_id,
          "WIDTH"
        );
        const bControl = generateControlString(
          b.start_point_id,
          b.end_point_id,
          "WIDTH"
        );
        const [aStart, aEnd] = aControl.split("-").map((n) => parseInt(n));
        const [bStart, bEnd] = bControl.split("-").map((n) => parseInt(n));

        if (!aStart || !aEnd || !bStart || !bEnd) {
          return 0;
        }

        const aRange = aEnd - aStart;
        const bRange = bEnd - bStart;
        return aRange !== bRange ? aRange - bRange : aStart - bStart;
      });

    // WIDTH 충돌 해결: 순차적 범위 할당
    const widthControlMap = new Map<string, string>();
    widthItems.forEach((item, index) => {
      widthControlMap.set(item.measurement_code, `${index + 1}-${index + 2}`);
    });

    const configs = sliderItems
      .map((item) => {
        const measurementData = measurementMap.get(item.measurement_code);
        if (!measurementData) return null;

        const {
          value,
          min: minRange,
          max: maxRange,
          value_type,
          label,
        } = measurementData;
        const originalControl = generateControlString(
          item.start_point_id,
          item.end_point_id,
          value_type
        );

        let adjustedValue = value;
        let isPartialControl = false;
        let control = originalControl;

        // WIDTH 타입 처리
        if (value_type === "WIDTH") {
          const newControl = widthControlMap.get(item.measurement_code);
          if (newControl) {
            control = newControl;
            const currentIndex = widthItems.findIndex(
              (wi) => wi.measurement_code === item.measurement_code
            );
            if (currentIndex > 0) {
              const prevItem = widthItems[currentIndex - 1];

              if (!prevItem) {
                return null;
              }

              const prevMeasurementData = measurementMap.get(
                prevItem.measurement_code
              );
              if (prevMeasurementData) {
                adjustedValue = value - prevMeasurementData.value;
                isPartialControl = true;
              }
            }
          }
        }

        const adjustedMin = adjustedValue - minRange;
        const adjustedMax = adjustedValue + maxRange;

        return {
          code: item.measurement_code,
          label: label,
          average: adjustedValue,
          control: control,
          originalControl: originalControl,
          initialValue: adjustedValue,
          max: adjustedMax,
          min: adjustedMin,
          snapValues: generateSnapValues(adjustedMin, adjustedMax),
          value_type: value_type,
          isPartialControl: isPartialControl,
          originalValue: value,
          originalAverage: value,
          originalInitialValue: value,
          originalMin: value - minRange,
          originalMax: value + maxRange,
          baseMinRange: minRange,
          baseMaxRange: maxRange,
        };
      })
      .filter((item): item is SliderConfig => item !== null);

    setSliderConfigs(configs);
  }, []);

  const updateConfig = (
    index: number,
    field: keyof SliderConfig,
    value: string
  ): void => {
    const newConfigs = [...sliderConfigs];
    const config = { ...newConfigs[index] };

    if (field === "min" || field === "max") {
      const numValue = parseFloat(value) || 0;
      config[field] = numValue;
      config.snapValues = generateSnapValues(config.min || 0, config.max || 0);
    } else if (field === "average" || field === "initialValue") {
      config[field] = parseFloat(value) || 0;
    }

    newConfigs[index] = config as SliderConfig;
    setSliderConfigs(newConfigs);
  };

  const addNewConfig = (): void => {
    const newConfig: SliderConfig = {
      code: "",
      label: "",
      average: 0,
      control: "",
      originalControl: "",
      initialValue: 0,
      max: 0,
      min: 0,
      snapValues: [0],
      value_type: "WIDTH",
      isPartialControl: false,
      originalValue: 0,
      originalAverage: 0,
      originalInitialValue: 0,
      originalMin: 0,
      originalMax: 0,
      baseMinRange: 0,
      baseMaxRange: 0,
    };
    setSliderConfigs([...sliderConfigs, newConfig]);
  };

  const deleteConfig = (index: number): void => {
    setSliderConfigs(sliderConfigs.filter((_, i) => i !== index));
  };

  const saveConfig = (): void => {
    console.log("최종 슬라이더 설정:", JSON.stringify(sliderConfigs, null, 2));
    alert("설정이 콘솔에 저장되었습니다!");
  };

  // 컨트롤 범위 시각화 컴포넌트
  const ControlVisualizer: React.FC<{
    control: string;
    originalControl: string;
    valueType: "WIDTH" | "LENGTH";
    isPartialControl: boolean;
  }> = ({ control, originalControl, valueType, isPartialControl }) => {
    const renderBar = (controlString: string, isOriginal = false) => {
      const [start, end] = controlString.split("-");
      const range =
        valueType === "WIDTH" ? ["1", "2", "3", "4"] : ["a", "b", "c", "d"];

      if (!start || !end) {
        return null;
      }

      const startIndex = range.indexOf(start);
      const endIndex = range.indexOf(end);
      const color = isOriginal
        ? "bg-red-400"
        : valueType === "WIDTH"
          ? "bg-blue-500"
          : "bg-green-500";

      return (
        <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            {range.map((item, i) => (
              <div
                key={i}
                className={`flex-1 h-full ${i >= startIndex && i <= endIndex ? color : "bg-gray-300"}`}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex justify-between items-center px-0.5">
            {range.map((item, i) => (
              <span key={i} className="text-xs text-white font-bold">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono min-w-8 font-bold">{control}</span>
          {renderBar(control)}
          <span className="text-xs text-blue-600">현재</span>
        </div>
        {isPartialControl && originalControl !== control && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono min-w-8 line-through text-gray-500">
              {originalControl}
            </span>
            {renderBar(originalControl, true)}
            <span className="text-xs text-red-500">원래</span>
          </div>
        )}
      </div>
    );
  };

  // 타입별로 그룹화
  const groupedConfigs = sliderConfigs.reduce(
    (groups, config, index) => {
      const type = config.value_type;
      if (!groups[type]) groups[type] = [];
      groups[type].push({ ...config, originalIndex: index });
      return groups;
    },
    {} as Record<
      "WIDTH" | "LENGTH",
      Array<SliderConfig & { originalIndex: number }>
    >
  );

  const renderTable = (
    configs: Array<SliderConfig & { originalIndex: number }>,
    type: "WIDTH" | "LENGTH"
  ) => (
    <div className="mb-6" key={type}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded text-sm ${
            type === "WIDTH"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {type}
        </span>
        <span className="text-sm text-gray-500">({configs.length}개)</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              {[
                "코드",
                "라벨",
                "컨트롤 범위",
                "기본범위",
                "현재 평균",
                "원래 평균",
                "현재 초기",
                "원래 초기",
                "현재 최소",
                "원래 최소",
                "현재 최대",
                "원래 최대",
                "스냅 값",
                "액션",
              ].map((header, i) => (
                <th
                  key={i}
                  className={`px-2 py-2 text-xs font-medium border-b ${
                    [4, 6, 8, 10].includes(i)
                      ? "text-blue-600"
                      : [5, 7, 9, 11].includes(i)
                        ? "text-gray-500"
                        : "text-gray-700"
                  } ${[3, 4, 5, 6, 7, 8, 9, 10, 11, 13].includes(i) ? "text-center" : "text-left"}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <tr key={config.originalIndex} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-xs border-b">
                  <div className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {config.code}
                    {config.isPartialControl && (
                      <span title="부분적 조정">🔗</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs border-b">
                  <div className="text-gray-700 flex items-center gap-1">
                    {config.label}
                    {config.isPartialControl && (
                      <span
                        className="text-xs text-blue-600"
                        title="부분적 조정"
                      >
                        (차이값)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 border-b">
                  <ControlVisualizer
                    control={config.control}
                    originalControl={config.originalControl}
                    valueType={config.value_type}
                    isPartialControl={config.isPartialControl}
                  />
                </td>
                <td className="px-2 py-2 border-b text-center">
                  <div className="text-xs text-gray-600">
                    <div>±{config.baseMinRange}</div>
                    <div>±{config.baseMaxRange}</div>
                  </div>
                </td>
                {[
                  [config.average, true],
                  [config.originalAverage, false],
                  [config.initialValue, true],
                  [config.originalInitialValue, false],
                  [config.min, true],
                  [config.originalMin, false],
                  [config.max, true],
                  [config.originalMax, false],
                ].map(([value, editable], i) => (
                  <td key={i} className="px-2 py-2 border-b">
                    {editable ? (
                      <input
                        type="number"
                        step="0.1"
                        value={value as number}
                        onChange={(e) =>
                          updateConfig(
                            config.originalIndex,
                            ["average", "initialValue", "min", "max"][
                              Math.floor(i / 2)
                            ] as keyof SliderConfig,
                            e.target.value
                          )
                        }
                        className="w-14 px-1 py-1 text-xs border border-blue-300 rounded text-center focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 px-1 py-1 rounded text-center">
                        {value}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-2 py-2 border-b">
                  <div className="flex flex-wrap gap-1 max-w-24">
                    {config.snapValues.slice(0, 4).map((snap, i) => (
                      <span
                        key={i}
                        className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {snap}
                      </span>
                    ))}
                    {config.snapValues.length > 4 && (
                      <span className="text-xs text-gray-400">
                        +{config.snapValues.length - 4}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 border-b text-center">
                  <button
                    onClick={() => deleteConfig(config.originalIndex)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">슬라이더 설정 관리</h1>
        <div className="flex gap-2">
          <button
            onClick={addNewConfig}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            <Plus size={16} /> 추가
          </button>
          <button
            onClick={saveConfig}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            <Save size={16} /> 저장
          </button>
        </div>
      </div>

      {Object.keys(groupedConfigs).length > 0 ? (
        Object.entries(groupedConfigs).map(([type, configs]) =>
          renderTable(configs, type as "WIDTH" | "LENGTH")
        )
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">설정된 슬라이더가 없습니다.</p>
          <button
            onClick={addNewConfig}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto"
          >
            <Plus size={16} /> 첫 번째 슬라이더 추가
          </button>
        </div>
      )}
    </div>
  );
};

export default SliderConfigManager;
