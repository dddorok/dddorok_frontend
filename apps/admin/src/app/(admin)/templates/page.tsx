import { AlertCircle, Info } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCategoryById } from "@/constants/category";
import { GuideCard } from "@/features/templates/components/GuideCard";
import { TemplateList } from "@/features/templates/components/template-list";
import { templates, chartTypes as chartTypesList, Template } from "@/lib/data";
export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">템플릿 관리</h2>
      </div>
      <GuideCard />

      <Alert
        variant="default"
        className="bg-blue-50 text-blue-800 border-blue-200"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          새로운 템플릿을 추가하려면 [치수 규칙 설정] 메뉴에서 규칙을 선택한 후
          템플릿을 생성해주세요.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button size="lg" asChild>
          <Link href="/templates/new">새 템플릿 추가</Link>
        </Button>
      </div>

      <TemplateList />

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p>
            <strong>샘플 데이터 안내:</strong> 현재 보이는 데이터는
            예시용입니다. 실제 구현 시 백엔드 API와 연동하여 실제 데이터를
            표시해야 합니다.
          </p>
          <p className="mt-1">
            <strong>데이터 모델 참고:</strong> 각 템플릿은 measurementRuleId
            필드를 통해 치수 규칙과 연결됩니다.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
