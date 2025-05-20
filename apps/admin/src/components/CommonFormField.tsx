import { ComponentProps } from "react";

import { CommonSelect } from "./CommonUI";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { cn } from "@/lib/utils";

interface CommonFieldProps {
  name: string;
  label: string;
}

interface CommonSelectFieldProps
  extends CommonFieldProps,
    Omit<ComponentProps<typeof CommonSelect>, "onChange"> {
  onChange?: ComponentProps<typeof CommonSelect>["onChange"];
}

export function CommonSelectField(props: CommonSelectFieldProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <CommonSelect
              {...props}
              onChange={(value) => {
                props.onChange?.(value);
                field.onChange(value);
              }}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CommonInputField(
  props: CommonFieldProps & ComponentProps<typeof Input>
) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={props.placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CommonCheckboxListField(
  props: CommonFieldProps & {
    options: { label: string; value: string }[];
    className?: string;
  }
) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <div className={cn("flex flex-col gap-2", props.className)}>
            {props.options.map(({ label, value }) => (
              <div className="flex items-center space-x-2" key={value}>
                <Checkbox
                  id={value}
                  checked={field.value?.includes(value)}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value || [];
                    if (checked) {
                      field.onChange([...currentValue, value]);
                    } else {
                      field.onChange(
                        currentValue.filter((v: string) => v !== value)
                      );
                    }
                  }}
                />
                <Label htmlFor={value} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
