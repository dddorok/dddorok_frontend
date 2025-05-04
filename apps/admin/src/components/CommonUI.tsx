import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const CommonSelect = <T extends string>(props: {
  options: { label: string; value: T }[];
  value: T;
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
