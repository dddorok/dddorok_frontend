import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogDefaultProps } from "@/components/ui/dialog";

interface AlertDialogProps extends DialogDefaultProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  onAction: () => Promise<void> | void;
  actionVariant?: ButtonProps["color"];
  actionText?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  onAction,
  title,
  description,
  actionVariant = "fill",
  actionText = "확인",
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent isCloseable={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button color="trans" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button color={actionVariant} onClick={onAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
