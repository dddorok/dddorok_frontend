import { useState } from "react";

import { cn } from "@/lib/utils";

interface RadioOptionType {
  id: string;
  label: string | React.ReactNode;
  content?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOptionType[];
  defaultSelected?: string;

  value?: string;
  onChange?: (value: string) => void;

  className?: string;
}

export function RadioGroup(props: RadioGroupProps) {
  const [selected, setSelected] = useState(props.defaultSelected);

  const onChange = (value: string) => {
    setSelected(value);
    props.onChange?.(value);
  };

  return (
    <div className={cn("radio-group", "flex flex-col gap-4", props.className)}>
      {props.options.map((option) => (
        <Radio
          key={option.id}
          {...option}
          isSelected={selected === option.id}
          onClick={() => onChange(option.id)}
        />
      ))}
    </div>
  );
}

function Radio(
  props: RadioOptionType & { isSelected: boolean; onClick: () => void }
) {
  return (
    <div className="group/option" data-selected={props.isSelected}>
      <button
        className={cn("flex items-center gap-2", "radio-option")}
        onClick={props.onClick}
        data-selected={props.isSelected}
      >
        {props.isSelected ? <RadioOn /> : <RadioOff />}
        <div
          className={cn(
            "text-small",
            "text-neutral-N600",
            props.isSelected && "text-neutral-N900"
          )}
        >
          {props.label}
        </div>
      </button>
      {props.content}
    </div>
  );
}

function RadioOn() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" fill="white" stroke="#E2E8F0" />
      <circle cx="8" cy="8" r="4" fill="#32A7FF" />
    </svg>
  );
}

function RadioOff() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" fill="white" stroke="#E2E8F0" />
    </svg>
  );
}
