import { ComponentProps } from "react";

import { CommonSelect } from "./CommonUI";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

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
