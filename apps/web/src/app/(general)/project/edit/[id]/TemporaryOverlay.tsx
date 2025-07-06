import { Button } from "@/components/ui/button";

export function TemporaryOverlay() {
  return (
    <div className="flex flex-col gap-4 items-center text-neutral-N0 text-center justify-center py-12 bg-neutralAlpha-NA40">
      ⚠️
      <br />
      이 프로젝트는 임의 게이지로 생성되어 있어 편집과 저장이 제한됩니다.
      <br /> 스와치 측정 후, 실제 게이지를 등록해 주세요.
      <Button color="white">게이지 등록하기</Button>
    </div>
  );
}
