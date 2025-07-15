import CommonLayout from "@/components/layout/MainLayout";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommonLayout>
      <div className="py-16 px-8">
        <div className="flex items-center justify-between gap-4 flex-col">
          <h2 className="text-[32px] font-semibold text-neutral-1000">
            뜨도록의 멤버십으로 쉽게 도안을 제작해보세요.
          </h2>
          <p className="text-medium-r text-[#4E4E4E]">
            뜨도록 구독하고 다양한 템플릿을 이용해보세요.
          </p>
        </div>
      </div>
      {children}
    </CommonLayout>
  );
}
