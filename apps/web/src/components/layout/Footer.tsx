import Image from "next/image";

import { cn } from "@/lib/utils";

export default function Footer(props: { className?: string }) {
  return (
    <div className={cn(" w-full", props.className)}>
      <div className="container px-8  pt-16 pb-6 ">
        <div className="w-full flex items-center gap-5">
          <Image
            src="/assets/logo/type_02.svg"
            alt="dddorok"
            width={60}
            height={37}
          />
          <hr className="h-[1px] bg-neutral-N200 flex-1 border-none" />
        </div>
        <div className="text-medium text-neutral-N600 mt-8">
          <div className="flex gap-2 items-center">
            대표: 김수지 <span className={dividerStyle}>|</span>
            사업자등록번호: 178-65-00786 <span className={dividerStyle}>|</span>
            통신판매번호: 수정예정{" "}
            {/* <a href="#" className="text-primary-PR text-small underline">
              사업자번호조회
            </a> */}
          </div>
          <div className="flex gap-2 items-center">
            이메일: help@dddorok.com <span className={dividerStyle}>|</span>
            서울시 성동구 살곶이길 50 8층
          </div>
          <div>©2025 DDDOROK • All rights reserved.</div>
        </div>
        <div className="mt-6">
          <img src="/assets/icons/instagram.svg" alt="instagram" />
        </div>
        <hr className="bg-neutral-N200 h-[1px] mt-9 border-none" />
        <div className="flex gap-2 items-center text-medium text-neutral-N900 h-[40px] mt-4 mb-6">
          이용약관 <span className={dividerStyle}>|</span> 개인정보처리방침
          <span className={dividerStyle}>|</span> 저작권 안내
        </div>
      </div>
    </div>
  );
}

const dividerStyle = cn("text-neutral-N400", "text-medium");
