import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { projectQueries, projectQueryKey } from "@/queries/project";
import { updateProject } from "@/services/project";
export function TemporaryOverlay({ project_id }: { project_id: string }) {
  const queryClient = useQueryClient();
  const formDataRef = useRef<{ dan: string; co: string }>({
    dan: "",
    co: "",
  });
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const onSubmit = async () => {
    if (formDataRef.current.dan === "" || formDataRef.current.co === "") {
      return;
    }

    await updateProject(project_id, {
      gauge_ko: Number(formDataRef.current.co),
      gauge_dan: Number(formDataRef.current.dan),
    });

    await queryClient.invalidateQueries({
      queryKey: [projectQueryKey],
    });

    toast("프로젝트가 새로 등록된 게이지 기준으로 업데이트 되었습니다.");
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
      <GaugeRegisterDialog
        onSubmit={(data) => {
          formDataRef.current = data;
          setIsOpenConfirm(true);
        }}
      />
      <SubmitConfirmDialog
        isOpen={isOpenConfirm}
        onSubmit={onSubmit}
        onClose={() => setIsOpenConfirm(false)}
      />
    </div>
  );
}

function GaugeRegisterDialog({
  onSubmit,
}: {
  onSubmit: (data: { dan: string; co: string }) => void;
}) {
  const [data, setData] = useState({
    dan: "",
    co: "",
  });

  const isDisabled = data.dan === "" || data.co === "";

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
            <Input
              value={data.dan}
              onChange={(e) => setData({ ...data, dan: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label className="text-neutral-1000 text-small">코</Label>
            <Input
              value={data.co}
              onChange={(e) => setData({ ...data, co: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              color="fill"
              className="flex-1 w-full"
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                onSubmit(data);
              }}
            >
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
