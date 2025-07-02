import { Shape } from "./Shape.constants";

export interface CellType {
  row: number;
  col: number;
}

export interface CellDataType extends CellType {
  shape: Shape;
  disabled?: boolean; // 비활성화 셀 여부
}

export interface DisabledCellDataType extends CellType {}
