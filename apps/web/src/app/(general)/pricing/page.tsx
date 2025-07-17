/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div>
      <section className="py-[64px]">
        <h2 className="text-h3 text-neutral-900 flex items-center gap-[10px] justify-center">
          <img
            src="/assets/images/pricing/plan-price.png"
            width={22}
            height={22}
            alt=""
            className="w-[22px] h-[22px]"
          />
          플랜 선택하기
        </h2>
        <div className="flex gap-[30px] mt-6 ">
          <PlanItem
            title="체험판(무료)"
            originalPrice={8800}
            monthlyPrice={0}
            totalPrice={0}
            features={[
              "템플릿 1종 편집 및 저장",
              "프로젝트 1개 제공",
              "기호 Kit 4종 제공",
            ]}
            buttonElement={
              <Button color="fill" className="px-[46px]" asChild>
                <Link href={ROUTE.TEMPLATE}>체험판 사용해보기</Link>
              </Button>
            }
            className="border-neutral-N300"
          />{" "}
          <PlanItem
            className="border-primary-PR-darker"
            title="3개월 멤버십"
            originalPrice={8800}
            monthlyPrice={4400}
            totalPrice={13200}
            features={[
              "모든 템플릿 제한없이 이용 가능",
              "프로젝트 10개 제공",
              "기호 Kit 제한없이 이용",
            ]}
            buttonElement={
              <Button color="fill" className="px-[46px]">
                3개월 이용권 구매
              </Button>
            }
            highlight={true}
            highlightText="오픈 이벤트 50% 할인"
          />
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8162 4.20701C14.0701 4.47369 14.0597 4.89568 13.793 5.14954L6.08928 12.4829C5.95772 12.6081 5.78076 12.6742 5.59932 12.666C5.41787 12.6577 5.24765 12.5758 5.12801 12.4391L2.16505 9.05451C1.92253 8.77747 1.9505 8.35629 2.22754 8.11377C2.50457 7.87125 2.92575 7.89923 3.16827 8.17626L5.67341 11.0379L12.8737 4.1838C13.1404 3.92994 13.5623 3.94033 13.8162 4.20701Z"
        fill="#75C0EF"
      />
    </svg>
  );
}

function PlanItem(props: {
  title: string;
  label?: string;
  originalPrice: number;
  monthlyPrice: number;
  totalPrice: number;
  features: string[];
  buttonElement: React.ReactNode;
  className?: string;
  highlight?: boolean;
  highlightText?: string;
}) {
  return (
    <div
      className={cn(
        "p-[21px] rounded-[16px] border border-neutral-N400 flex flex-col items-center justify-center gap-4 flex-1",
        props.className
      )}
    >
      <h3 className="text-large font-bold text-neutral-N900 flex items-center gap-[6px]">
        {props.highlight && (
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.25 5.41669C9.25 4.72502 9.80833 4.16669 10.5 4.16669C11.1917 4.16669 11.75 4.72502 11.75 5.41669C11.75 5.85835 11.5225 6.24502 11.1783 6.46752L13.4433 9.85585C13.5028 9.93971 13.5912 9.99861 13.6915 10.0212C13.7918 10.0438 13.8969 10.0286 13.9867 9.97835L15.6383 8.90752C15.5392 8.71694 15.491 8.50401 15.4983 8.28933C15.5056 8.07465 15.5682 7.86548 15.6799 7.68206C15.7917 7.49863 15.9489 7.34715 16.1364 7.24227C16.3239 7.13739 16.5352 7.08265 16.75 7.08335C17.4417 7.08335 18 7.64169 18 8.33335C18 8.92252 17.5942 9.41585 17.0467 9.54835L15.86 15.3925C15.81 15.6509 15.6017 15.8334 15.36 15.8334H5.64C5.39833 15.8334 5.19 15.65 5.14 15.3917L3.95334 9.54835C3.68115 9.48216 3.43915 9.32634 3.26623 9.10597C3.09332 8.88559 2.99955 8.61347 3 8.33335C3 7.64169 3.55834 7.08335 4.25 7.08335C4.46473 7.0828 4.67598 7.13764 4.86332 7.24258C5.05066 7.34752 5.20777 7.49901 5.31945 7.68241C5.43113 7.86582 5.49362 8.07493 5.50087 8.28954C5.50812 8.50415 5.45989 8.717 5.36084 8.90752L7.0125 9.97835C7.1023 10.0288 7.20761 10.0442 7.30811 10.0216C7.4086 9.99897 7.49715 9.93992 7.55667 9.85585L9.82167 6.46752C9.64597 6.35428 9.50155 6.19871 9.40166 6.0151C9.30177 5.83148 9.24962 5.62571 9.25 5.41669Z"
              fill="#FDDC5C"
            />
          </svg>
        )}
        {props.title}
        {props.highlightText && (
          <p className="text-medium font-semibold rounded-[6px] bg-primary-PR-darker leading-[28px] px-2 text-neutral-N0">
            {props.highlightText}
          </p>
        )}
      </h3>
      <div>
        <div className="flex items-end gap-2">
          <span className="text-[16px] text-neutral-N500 line-through italic leading-[28px]">
            {props.originalPrice}원
          </span>
          <div>
            <span className="text-h2 text-neutral-N900">
              {props.monthlyPrice}
            </span>
            <span className="text-large text-neutral-N500 ml-1">/월</span>
          </div>
        </div>
        <div>
          <span className="text-small text-neutral-N700">총 결제 금액</span>{" "}
          <span className="text-medium font-bold text-primary-PR">
            {props.totalPrice}원
          </span>
        </div>
      </div>
      <div>
        <ul className="flex flex-col gap-[14px] items-center">
          {props.features.map((feature) => (
            <li
              key={feature}
              className="text-small text-neutral-N800 flex items-center gap-2"
            >
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {props.buttonElement}
    </div>
  );
}
