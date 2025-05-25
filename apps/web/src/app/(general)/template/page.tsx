"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const TAB = ["전체", "스웨터", "가디건", "베스트"];
export default function TemplateListPage() {
  const [activeTab, setActiveTab] = useState(TAB[0]);
  return (
    <div>
      <Header />
      <div className="pt-16 px-8 pb-12">
        <div className="flex items-center justify-between gap-4 flex-col">
          <h2 className="text-[32px] font-semibold text-neutral-1000">
            템플릿으로 뜨개 도안을 만들어보세요.
          </h2>
          <p className="text-medium-r text-[#4E4E4E]">
            도안 제작 경험이 없어도 누구나 디자인할 수 있어요.
          </p>
        </div>
      </div>
      <div className="mt-1 border-t border-[0.5px] border-neutralAlpha-NA20 py-6">
        <div className="flex items-center justify-center gap-5">
          {TAB.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-h3 px-5 py-3 text-primary-PR text-[24px] font-semibold",
                activeTab === tab && "bg-primary-PR text-neutral-N0 rounded-xl"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[30px] container pt-12">
        <div>
          <div className="bg-neutral-N300 h-[200px]"></div>
          <p className="text-[21px] text-neutral-N800 font-medium py-2">
            바텀업 라운드넥 레글런형 스웨터
          </p>
        </div>
      </div>
      {/* <Slider /> */}
    </div>
  );
}

// function Slider() {
//   const prevRef = useRef<HTMLButtonElement>(null);
//   const nextRef = useRef<HTMLButtonElement>(null);

//   const cards = [
//     {
//       title: "바텀업 라운드넥 레글런형 스웨터",
//       image: "/api/placeholder/250/250",
//     },
//     {
//       title: "바텀업 브이넥 싯인형 가디건",
//       image: "/api/placeholder/250/250",
//     },
//     {
//       title: "원통형 브이넥 레글런형 스웨터",
//       image: "/api/placeholder/250/250",
//     },
//     {
//       title: "탑다운 라운드넥 싯인형 스웨터",
//       image: "/api/placeholder/250/250",
//     },
//     {
//       title: "바텀업 터틀넥 레글런형 스웨터",
//       image: "/api/placeholder/250/250",
//     },
//     {
//       title: "원통형 하이넥 싯인형 가디건",
//       image: "/api/placeholder/250/250",
//     },
//   ];

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 bg-white">
//       <div className="relative">
//         {/* 왼쪽 화살표 */}
//         <button
//           ref={prevRef}
//           className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
//           style={{ marginLeft: "-20px" }}
//         >
//           <ChevronLeft className="w-6 h-6 text-gray-600" />
//         </button>
//         {/* 오른쪽 화살표 */}
//         <button
//           ref={nextRef}
//           className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
//           style={{ marginRight: "-20px" }}
//         >
//           <ChevronRight className="w-6 h-6 text-gray-600" />
//         </button>
//         <Swiper
//           modules={[Navigation]}
//           spaceBetween={16}
//           slidesPerView={3}
//           navigation={{
//             prevEl: prevRef.current,
//             nextEl: nextRef.current,
//           }}
//           onInit={(swiper) => {
//             // @ts-ignore
//             swiper.params.navigation.prevEl = prevRef.current;
//             // @ts-ignore
//             swiper.params.navigation.nextEl = nextRef.current;
//             swiper.navigation.init();
//             swiper.navigation.update();
//           }}
//           className="!pl-12 !pr-12"
//         >
//           {cards.map((card, index) => (
//             <SwiperSlide key={index}>
//               <div className="flex-shrink-0 w-72">
//                 <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
//                   {/* 이미지 영역 */}
//                   <div className="h-64  bg-neutral-N300 flex items-center justify-center">
//                     <div className="w-32 h-32 bg-neutral-N100-25A"></div>
//                   </div>
//                   {/* 텍스트 영역 */}
//                   <div className="p-4">
//                     <h3 className="text-sm font-medium text-gray-800 leading-relaxed">
//                       {card.title}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }
