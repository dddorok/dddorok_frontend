import Link from "next/link";
import { Suspense } from "react";

import { MeasurementRuleTable } from "./_components/measurement-rule-table";

import { Button } from "@/components/ui/button";

export default function MeasurementRulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">치수 규칙 설정</h2>
      </div>

      <div className="flex justify-end">
        <Link href="/measurement-rules/new">
          <Button size="lg">새 치수 규칙 추가</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Suspense>
          <MeasurementRuleTable />
        </Suspense>
      </div>
    </div>
  );
}
