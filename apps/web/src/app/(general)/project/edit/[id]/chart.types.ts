import { Shape } from "./Dotting/Shape.constants";

export interface Cell {
  row: number;
  col: number;
  shape: Shape | undefined;
}
