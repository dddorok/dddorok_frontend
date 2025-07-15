import Image from "next/image";
import Link from "next/link";

import { JoinTermDialog } from "./(home)/JoinTermDialog";

import Body from "@/components/layout/Body";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";

export default function Home() {
  return (
    <>
      <div className="relative">
        <div className="bg-[url('/main-bg.png')] bg-cover bg-center min-h-screen absolute top-0 left-0 right-0 z-[-1]"></div>
        <div className="flex flex-col min-h-screen">
          <Header className="bg-neutral-N100-25A border-x-primary-PR200A60 shadow-[0px_4px_24px_0px_rgba(28,31,37,0.05)]" />
          <Body className="pt-16 pb-20">
            <div className="px-4 flex pb-4 flex-col items-center justify-center">
              <p className="text-neutral-N800 text-h4 font-medium">✦</p>
              <Image
                src="/images/main/stress-less.png"
                width={254}
                height={32}
                alt="stress-less"
                className="mt-[16px] mb-6"
                priority
              />
              <h1 className="text-center text-neutral-N900 text-h1 font-medium">
                상상한 모든 것을{" "}
                <strong className="font-bold text-neutral-1000">뜨도록</strong>
              </h1>
              <p className="mt-6 text-center text-neutral-N900 text-lead opacity-80">
                뜨도록은 다양한 템플릿을 활용해 누구나 쉽게 맞춤형 뜨개 도안을
                만들 수 있는 온라인 서비스입니다. <br />
                어려운 숫자 계산과 사이즈 고민 없이, 내 몸에 딱 맞는 뜨개 작품을
                간편하고 빠르게 완성해 보세요.
                <br />
                누구나 전문가 수준의 도안을 제작할 수 있습니다.
              </p>
              <Button className="mt-10 min-w-[270px]" asChild>
                <Link href={ROUTE.TEMPLATE}>템플릿 보러가기</Link>
              </Button>
            </div>
          </Body>
          <Footer className="bg-neutral-N100-50A" />
          <JoinTermDialog />
        </div>
      </div>
    </>
  );
}
