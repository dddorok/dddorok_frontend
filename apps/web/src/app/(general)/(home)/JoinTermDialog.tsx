"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AlertDialog } from "@/components/common/Dialog/AlertDialog";
import { Button } from "@/components/ui/button";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ROUTE } from "@/constants/route";
import { deleteSession } from "@/lib/auth";
import { userQueries } from "@/queries/users";
import { signUp } from "@/services/auth";

export function JoinTermDialog() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: myInfo } = useQuery(userQueries.myInfo());
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const { mutate: signUpMutation } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries(userQueries.myInfo());
    },
  });

  const logout = async () => {
    await deleteSession();
    queryClient.removeQueries();
    router.replace(ROUTE.HOME);
  };

  return (
    <>
      <TermsDialog
        open={myInfo?.user.user_status === "PENDING"}
        onOpenChange={async (open) => {
          if (myInfo?.user.user_status === "PENDING") {
            setAlertDialogOpen(true);
          } else {
            return;
          }
          console.log("open: ", open, myInfo?.user.user_status === "PENDING");
        }}
        onAgree={() => signUpMutation()}
      />
      <AlertDialog
        title="이용약관에 동의하지 않겠습니까?"
        description="동의 취소시 로그아웃이 됩니다. "
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        onAction={() => {
          setAlertDialogOpen(false);
          logout();
        }}
      />
    </>
  );
}

function TermsDialog({
  open,
  onOpenChange,
  onAgree,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}) {
  const [checks, setChecks] = useState({
    terms: false,
    privacy: false,
    all: false,
  });

  useEffect(() => {
    if (checks.terms && checks.privacy) {
      if (!checks.all) setChecks((prev) => ({ ...prev, all: true }));
    } else {
      if (checks.all) setChecks((prev) => ({ ...prev, all: false }));
    }
  }, [checks.terms, checks.privacy]);

  const handleCheckedChange = (
    key: keyof typeof checks,
    checked: boolean | string
  ) => {
    setChecks({ ...checks, [key]: checked });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>뜨도록 이용약관</DialogTitle>
          <DialogDescription>뜨도록 이용약관 </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <CheckboxWithLabel
            id="all"
            checked={checks.all}
            onCheckedChange={(checked: boolean) => {
              setChecks({
                ...checks,
                all: checked,
                terms: checked,
                privacy: checked,
              });
            }}
            label={
              <div className="font-semibold">다음 모든 항목에 동의합니다.</div>
            }
          />
          <CheckboxWithLabel
            id="terms"
            checked={checks.terms}
            onCheckedChange={(checked) => handleCheckedChange("terms", checked)}
            label={
              <>
                (필수) <strong className="font-[400]">이용약관</strong>에
                동의합니다.
              </>
            }
          />
          <CheckboxWithLabel
            id="privacy"
            checked={checks.privacy}
            onCheckedChange={(checked) =>
              handleCheckedChange("privacy", checked)
            }
            label={
              <>
                (필수){" "}
                <strong className="font-[400]">개인정보 수집 및 사용</strong>에
                동의합니다.
              </>
            }
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            color="fill"
            disabled={!checks.privacy || !checks.terms}
            onClick={onAgree}
          >
            동의하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
