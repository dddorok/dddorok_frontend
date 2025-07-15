import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div>
      <section className="">
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
        <div className="flex gap-[30px] mt-6">
          <PlanItem
            title="체험판(무료)"
            originalPrice={8000}
            monthlyPrice={0}
            totalPrice={0}
            features={[
              "템플릿 1종 편집 및 저장",
              "프로젝트 1개 제공",
              "기호 Kit 4종 제공",
            ]}
            buttonElement={<Button>구독하기</Button>}
            className="border-neutral-N300"
          />{" "}
          <PlanItem
            title="체험판(무료)"
            originalPrice={8000}
            monthlyPrice={0}
            totalPrice={0}
            features={[
              "템플릿 1종 편집 및 저장",
              "프로젝트 1개 제공",
              "기호 Kit 4종 제공",
            ]}
            buttonElement={<Button>구독하기</Button>}
            className="border-neutral-N300"
          />
        </div>
      </section>
    </div>
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
}) {
  return (
    <div
      className={cn(
        "p-[21px] rounded-[16px] border border-neutral-N400 flex flex-col items-center justify-center gap-6 flex-1",
        props.className
      )}
    >
      <h3 className="text-large font-bold text-neutral-N900">{props.title}</h3>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-price-01 text-neutral-N500 line-through italic">
            {props.originalPrice}
          </span>
          <div>
            <span className="text-h2 text-neutral-N900">
              {props.monthlyPrice}
            </span>
            <span className="text-large text-neutral-N500">/월</span>
          </div>
        </div>
        <div>
          <span className="text-small text-neutral-N700">총 결제 금액</span>{" "}
          <span className="text-medium font-bold text-primary-PR">
            {props.totalPrice}
          </span>
        </div>
      </div>
      <div>
        <ul className="flex flex-col gap-2 items-center">
          {props.features.map((feature) => (
            <li key={feature} className="text-small text-neutral-N800">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {props.buttonElement}
    </div>
  );
}
