import { ControlPoint, PathDefinition, Point } from "@dddorok/utils";
import { createContext, useContext, useState } from "react";

import { useAdjuestment } from "./useAdjuestment";
import { getAdjustedPath } from "../_utils/getAdjustedPath";
import { GridAdjustments } from "../types";
import { CalculationResult } from "./range.utils";

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

type AdjustmentContextType = {
  gridAdjustments: GridAdjustments;
  adjustedPoints: Point[];
  handleGridAdjustment: (gridKey: string, value: string) => void;
  resetAdjustments: () => void;
  adjustedPaths: AdjustedPath[];
};

type AdjustmentProgressingContextType = {
  adjustingKey: string | null;
  handleAdjustEnd: () => void;
  handleAdjustStart: (key: string) => void;
};

const AdjustmentProgressingContext =
  createContext<AdjustmentProgressingContextType>({
    adjustingKey: null,
    handleAdjustEnd: () => {},
    handleAdjustStart: () => {},
  });

const AdjustmentContext = createContext<AdjustmentContextType>({
  gridAdjustments: {},
  adjustedPoints: [],
  handleGridAdjustment: () => {},
  resetAdjustments: () => {},
  adjustedPaths: [],
});

export function AdjustmentProvider({
  children,
  gridPoints,
  pathDefs,
  sliderData,
}: {
  children: React.ReactNode;
  gridPoints: Point[];
  pathDefs: PathDefinition[];
  sliderData: CalculationResult[];
}) {
  const {
    gridAdjustments,
    adjustedPoints,
    handleGridAdjustment,
    resetAdjustments,
  } = useAdjuestment({ gridPoints, sliderData });

  const adjustedPaths = getAdjustedPath({
    adjustedPoints,
    gridPoints,
    pathDefinitions: pathDefs,
  });

  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustingKey, setAdjustingKey] = useState<string | null>(null);

  // 조정 시작 핸들러
  const handleAdjustStart = (key: string) => {
    setIsAdjusting(true);
    setAdjustingKey(key);
  };

  // 조정 종료 핸들러
  const handleAdjustEnd = () => {
    setIsAdjusting(false);
    setAdjustingKey(null);
  };

  return (
    <AdjustmentContext.Provider
      value={{
        gridAdjustments,
        adjustedPoints,
        handleGridAdjustment,
        resetAdjustments,
        adjustedPaths,
      }}
    >
      <AdjustmentProgressingContext.Provider
        value={{
          adjustingKey,
          handleAdjustEnd,
          handleAdjustStart,
        }}
      >
        {children}
      </AdjustmentProgressingContext.Provider>
    </AdjustmentContext.Provider>
  );
}

export const useAdjustmentContext = () => {
  const context = useContext(AdjustmentContext);
  if (!context) {
    throw new Error("useAdjustment must be used within an AdjustmentProvider");
  }
  return context;
};

export const useAdjustmentProgressingContext = () => {
  const context = useContext(AdjustmentProgressingContext);
  if (!context) {
    throw new Error(
      "useAdjustmentProgressing must be used within an AdjustmentProvider"
    );
  }
  return context;
};
