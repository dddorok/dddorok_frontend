import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GuideCard() {
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
          <strong>기능 개요:</strong> 템플릿 관리 페이지는 니트/뜨개 도안
          템플릿을 조회하고 관리하는 페이지입니다. 각 템플릿은 특정 치수 규칙과
          연결되어 있으며, 자동으로 계산된 템플릿명, 도구 유형, 차트 유형 등의
          정보를 표시합니다.
        </p>
        <p>
          <strong>주요 워크플로우:</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            치수 규칙 설정 메뉴에서 규칙을 선택하고 새 템플릿 추가 버튼으로
            템플릿 생성
          </li>
          <li>
            템플릿명은 카테고리, 제작 방식, 넥라인, 소매 유형 등을 조합하여 자동
            생성
          </li>
          <li>템플릿 상세 페이지에서 세부 치수 정보 입력 및 관리</li>
          <li>템플릿 목록에서 수정 및 삭제 기능으로 템플릿 관리</li>
        </ol>
        <p>
          <strong>개발 참고사항:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>템플릿 생성 시 필요한 조건부 입력 필드는 다음과 같이 구현:</li>
          <ul className="list-disc pl-5 mt-1">
            <li>대바늘 + 상의: 제작 방식(탑다운, 바텀업 등) 입력 활성화</li>
            <li>스웨터/가디건: 소매 유형, 넥라인 유형 입력 활성화</li>
            <li>차트형/혼합형 패턴: 차트 유형 선택 활성화</li>
          </ul>
          <li>
            치수 규칙의 카테고리와 소매 유형에 따라 추가 입력 항목이 표시됨
          </li>
          <li>
            템플릿명은 조건부 필드 값을 조합하여 자동 생성됨 (수동 입력 필요
            없음)
          </li>
          <li>템플릿 세부 치수는 사이즈 범위별로 엑셀 형식의 표에서 관리</li>
          <li>
            치수 규칙에 따라 카테고리는 자동으로 설정되며 사용자가 변경할 수
            없음
          </li>
        </ul>
        <p className="mt-3 bg-blue-50 p-2 rounded text-blue-800">
          <Info className="h-4 w-4 inline-block mr-1" /> <strong>UI 팁:</strong>{" "}
          템플릿 생성 시 입력한 값에 따라 템플릿명이 자동으로 생성되며, 세부
          치수는 엑셀에서 값을 복사하여 한번에 붙여넣기할 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
