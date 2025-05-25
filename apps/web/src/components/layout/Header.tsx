import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="flex flex-col items-start flex-1 max-w-[1204px] mx-auto">
      <div className="flex gap-10">
        <div>
          <img src="/logo/logo-01.svg" alt="logo" width={200} height={80.5} />
        </div>
        <ul>
          <li>템플릿</li>
          <li>요금제</li>
        </ul>
      </div>
      <div>
        <Button>로그인</Button>
        <Button>로그인</Button>
      </div>
    </div>
  );
}
