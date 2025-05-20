import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const CommonSelect = <T extends string>(props: {
  options: { label: string; value: T }[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  defaultValue?: T;
}) => {
  return (
    <Select
      onValueChange={props.onChange}
      defaultValue={props.defaultValue ?? undefined}
      value={props.value ?? undefined}
    >
      <SelectTrigger>
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const CommonRadioGroup = <T extends string>(props: {
  options: { label: string; value: T }[];
  value?: T;
  onChange: (value: T) => void;
  defaultValue?: T;
  className?: string;
}) => {
  return (
    <RadioGroup
      defaultValue={props.defaultValue}
      onValueChange={(value) => props.onChange(value as T)}
      className={props.className}
    >
      {props.options.map((option) => (
        <div className="flex items-center gap-2" key={option.value}>
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
