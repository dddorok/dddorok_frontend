export type DottingDataType = {
  key: string;
  value: DottingDataItemType[];
}[];

interface DottingDataItemType {
  key: number;
  value: {
    color: string;
  };
}
