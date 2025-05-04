import { AlertCircle } from "lucide-react";
import { ComponentProps } from "react";

import { AlertTitle, AlertDescription, Alert } from "./ui/alert";

interface AlertProps extends ComponentProps<typeof Alert> {
  children: React.ReactNode;
  title?: string;
  iconElement?: React.ReactNode;
}

export function BasicAlert({
  title,
  children,
  iconElement,
  ...props
}: AlertProps) {
  return (
    <Alert {...props}>
      {iconElement ?? <AlertCircle className="h-4 w-4" />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
