import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div>
      {/* TODO: 폰트 수정 */}
      <h1 className="leading-[58px] text-[21px] font-semibold text-neutral-N900 ">
        나의 프로젝트
      </h1>
      <div className="flex flex-col   mt-3 items-center gap-6">
        <p className="text-h3 text-center text-neutral-N500">
          현재 저장된 템플릿이 없습니다. <br />
          템플릿을 선택해 첫 도안을 만들어보세요.
        </p>
        <Button color="fill" className="w-[320px]">
          도안 제작하기
        </Button>
      </div>
    </div>
  );
}
