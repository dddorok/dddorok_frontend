import { ControlPoint, PathDefinition, Point } from "@dddorok/utils";
import { createContext, useContext } from "react";

import { useAdjuestment } from "./useAdjuestment";
import { getAdjustedPath } from "../_utils/getAdjustedPath";
import { GridAdjustments, OriginalGridSpacing } from "../types";

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

type AdjustmentContextType = {
  gridAdjustments: GridAdjustments;
  adjustedPoints: Point[];
  originalGridSpacing: OriginalGridSpacing;
  handleGridAdjustment: (gridKey: string, value: string) => void;
  resetAdjustments: () => void;
  adjustedPaths: AdjustedPath[];
};

const AdjustmentContext = createContext<AdjustmentContextType>({
  gridAdjustments: {},
  adjustedPoints: [],
  originalGridSpacing: {},
  handleGridAdjustment: () => {},
  resetAdjustments: () => {},
  adjustedPaths: [],
});

export function AdjustmentProvider({
  children,
  gridPoints,
  pathDefs,
}: {
  children: React.ReactNode;
  gridPoints: Point[];
  pathDefs: PathDefinition[];
}) {
  const {
    gridAdjustments,
    adjustedPoints,
    originalGridSpacing,
    handleGridAdjustment,
    resetAdjustments,
  } = useAdjuestment({ gridPoints });

  const adjustedPaths = getAdjustedPath({
    adjustedPoints,
    gridPoints,
    pathDefinitions: pathDefs,
  });

  return (
    <AdjustmentContext.Provider
      value={{
        gridAdjustments,
        adjustedPoints,
        originalGridSpacing,
        handleGridAdjustment,
        resetAdjustments,
        adjustedPaths,
      }}
    >
      {children}
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
