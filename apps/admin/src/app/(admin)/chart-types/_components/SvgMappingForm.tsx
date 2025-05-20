import { CommonSelect } from "@/components/CommonUI";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SelectMeasurementList(props: {
  list: {
    label: string;
    value: string;
    selected: boolean;
  }[];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-base">선택된 측정항목</Label>
      <div className="grid grid-cols-2 gap-2">
        {props.list.map(({ value, label, selected }) => {
          return (
            <div key={value} className="flex items-start space-x-2">
              <Checkbox id={value} checked={selected} />
              <Label htmlFor={value} className="text-sm cursor-pointer">
                {label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SelectPathList(props: {
  paths: { pathId: string; selectedMeasurement: string | null }[];
  options: { label: string; value: string }[];
  updateMeasurementCode: (pathId: string, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Path ID</div>
      {props.paths.map(({ pathId }) => {
        const value =
          props.paths.find((item) => item.pathId === pathId)
            ?.selectedMeasurement ?? undefined;

        return (
          <div key={pathId} className="flex items-center space-x-2 ml-4">
            <div className={cn(`flex-1 flex flex-col gap-2`)}>
              <div>{pathId}</div>
              <CommonSelect
                value={value}
                options={props.options}
                onChange={(value) => {
                  props.updateMeasurementCode(pathId, value);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
