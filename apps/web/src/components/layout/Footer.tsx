import Image from "next/image";

import { cn } from "@/lib/utils";

export default function Footer(props: { className?: string }) {
  return (
    <div className={cn("bg-neutral-N100-50A w-full", props.className)}>
      <div className="max-w-[1204px] px-8 mx-auto pt-16 pb-6 ">
        <Image
          src="/assets/logo/type_02.svg"
          alt="dddorok"
          width={60}
          height={37}
        />
        <div className="text-medium text-neutral-N600 mt-8">
          <div className="flex gap-2 items-center">
            대표: 바인드오프(Bindoff) <span className={dividerStyle}>|</span>
            사업자등록번호: 000-00-00000 <span className={dividerStyle}>|</span>
            통신판매번호: 000-서울성동-000호{" "}
            <a href="#" className="text-primary-PR text-small underline">
              사업자번호조회
            </a>
          </div>
          <div className="flex gap-2 items-center">
            이메일: help@dddorok.com <span className={dividerStyle}>|</span>
            고객센터: 0000-0000 <span className={dividerStyle}>|</span>
            서울시 성동구 살곶이길 50 8층
          </div>
          <div>©2025 DDDOROK • All rights reserved.</div>
        </div>
        <div className="mt-6">
          <img src="/assets/icons/instagram.svg" alt="instagram" />
        </div>
        <hr className="bg-neutral-N200 h-[1px] mt-9 border-none" />
        <div className="flex gap-2 items-center text-medium text-neutral-N900 h-[17px] mt-[17px] mb-6">
          이용약관 <span className={dividerStyle}>|</span> 개인정보처리방침
          <span className={dividerStyle}>|</span> 저작권 안내
        </div>
      </div>
    </div>
  );
}

const dividerStyle = cn("text-neutral-N400", "text-medium");
