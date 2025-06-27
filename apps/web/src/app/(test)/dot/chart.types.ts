import { Shape } from "./Shape.constants";

export interface Cell {
  row: number;
  col: number;
  shape: Shape | undefined;
}
