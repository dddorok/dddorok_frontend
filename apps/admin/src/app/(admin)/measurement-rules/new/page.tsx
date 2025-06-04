import { Info } from "lucide-react";

import { MeasurementRuleForm } from "./measurement-rule-form";

import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewMeasurementRulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 치수 규칙 추가</h1>
        <p className="text-muted-foreground">
          새로운 치수 규칙을 생성합니다. 규칙을 저장한 후 바로 이 규칙을
          사용하는 템플릿을 생성할 수도 있습니다.
        </p>
      </div>

      <Alert
        variant="default"
        className="bg-blue-50 border-blue-200 text-blue-800"
      >
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>중복 방지:</strong> 동일한 카테고리와 소매 유형 조합으로 이미
          규칙이 존재하는 경우 중복 생성이 방지됩니다.
        </AlertDescription>
      </Alert>

      <MeasurementRuleForm />
    </div>
  );
}
