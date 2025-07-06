import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TemporaryOverlay() {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const onSubmit = () => {
    toast("게이지 등록 완료", { duration: Infinity });
    setIsOpenConfirm(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-center text-neutral-N0 text-center justify-center py-12 bg-neutralAlpha-NA40",
        "fixed top-[100px] w-full z-50 h-fit"
      )}
    >
      ⚠️
      <br />
      이 프로젝트는 임의 게이지로 생성되어 있어 편집과 저장이 제한됩니다.
      <br /> 스와치 측정 후, 실제 게이지를 등록해 주세요.
      <GaugeRegisterDialog onSubmit={() => setIsOpenConfirm(true)} />
      <SubmitConfirmDialog
        isOpen={isOpenConfirm}
        onSubmit={onSubmit}
        onClose={() => setIsOpenConfirm(false)}
      />
    </div>
  );
}

function GaugeRegisterDialog({ onSubmit }: { onSubmit: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button color="white">게이지 등록하기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게이지 등록하기</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-[6px]">
            <Label className="text-neutral-1000 text-small">단</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label className="text-neutral-1000 text-small">코</Label>
            <Input />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button color="fill" className="flex-1 w-full" onClick={onSubmit}>
              게이지 등록
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubmitConfirmDialog({
  isOpen,
  onSubmit,
  onClose,
}: {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lead font-medium">
            게이지를 반영해 프로젝트를 업데이트할까요?
            <br /> 이 작업은 되돌릴 수 없습니다.
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-12">
          <DialogClose asChild>
            <Button color="trans" className="flex-1">
              나중에 할게요.
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button color="fill" className="flex-1" onClick={onSubmit}>
              업데이트
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
