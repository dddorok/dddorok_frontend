import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogDefaultProps,
} from "@/components/ui/dialog";

interface ConfirmDialogProps extends DialogDefaultProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  onAction: () => void;
  actionVariant?: "default" | "destructive";
  actionText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onAction,
  title,
  description,
  actionVariant = "destructive",
  actionText = "확인",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant={actionVariant} onClick={onAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
