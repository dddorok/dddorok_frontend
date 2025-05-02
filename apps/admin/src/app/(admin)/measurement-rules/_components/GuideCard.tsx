import { Info } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function GuideCard() {
  /* 기획 의도 및 개발자를 위한 설명 카드 */
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
          <Info className="h-5 w-5" />
          기획 의도 및 개발 지침
        </CardTitle>
      </CardHeader>
      <CardContent className="text-amber-700 space-y-2 text-sm">
        <p>
          <strong>기능 개요:</strong> 치수 규칙 설정은 의류 템플릿 생성의 기본이
          되는 측정 규칙을 정의하는 페이지입니다. 각 의류 유형과 소매 유형별로
          필요한 측정 항목들을 미리 정의하여 템플릿 생성 시 활용합니다.
        </p>
        <p>
          <strong>주요 워크플로우:</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>사용자는 대-중-소 카테고리를 선택하여 의류 유형을 지정</li>
          <li>필요시 소매 유형을 선택</li>
          <li>측정해야 할 항목들을 선택(어깨너비, 가슴너비 등)</li>
          <li>생성된 치수 규칙을 기반으로 템플릿 생성 가능</li>
        </ol>
        <p>
          <strong>개발 참고사항:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>데이터 처리:</strong> 실제 구현 시 카테고리 정보와 측정
            항목은 API를 통해 동적으로 로드되어야 함
          </li>
          <li>
            <strong>카테고리별 항목 분류:</strong> 측정 항목은
            카테고리(상의/하의/마감 등)와 세부 섹션(몸통/소매/목 등)으로
            구분하여 제공해야 함
          </li>
          <li>
            <strong>관계 모델링:</strong> 치수 규칙과 템플릿 간 1:N 관계 유지
            필요
          </li>
          <li>
            <strong>삭제 제한:</strong> 템플릿에서 사용 중인 치수 규칙은 삭제할
            수 없음 (사용 중인 템플릿이 있는 경우 삭제 전 경고 메시지 표시)
          </li>
          <li>
            <strong>중복 방지 로직:</strong> 동일한 카테고리와 소매 유형의
            조합으로 중복 규칙이 생성되지 않도록 방지 로직 구현
          </li>
        </ul>
        <p className="mt-3 bg-blue-50 p-2 rounded text-blue-800">
          <Info className="h-4 w-4 inline-block mr-1" /> <strong>UI 팁:</strong>{" "}
          측정 항목 수를 클릭하면 상세 측정 항목 목록을, 템플릿 수를 클릭하면
          연결된 템플릿 목록을 확인할 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
