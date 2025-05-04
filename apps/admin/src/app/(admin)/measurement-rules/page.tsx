import Link from "next/link";

import { GuideCard } from "./components/GuideCard";
import { MeasurementRuleList } from "./components/measurement-rule-list";
import { MeasurementRuleTable } from "./components/measurement-rule-table";

import { Button } from "@/components/ui/button";

export default function MeasurementRulesPage() {
  const data = [
    {
      id: "547f37d9-5650-426f-89cb-79dd28705088",
      rule_name: "상의 스웨터 라운드넥",
      category_large: "의류",
      category_medium: "상의",
      category_small: "스웨터",
      sleeve_type: "레글런",
      neck_line_type: "라운드넥",
      measurement_item_count: 2,
      template_count: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">치수 규칙 설정</h2>
      </div>

      <GuideCard />

      <div className="flex justify-end">
        <Link href="/measurement-rules/new">
          <Button size="lg">새 치수 규칙 추가</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <MeasurementRuleTable />
      </div>
    </div>
  );
  // return <MeasurementRuleList />;
}
