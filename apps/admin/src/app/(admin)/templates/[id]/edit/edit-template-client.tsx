"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  TemplateForm,
  TemplateFormData,
} from "@/app/(admin)/templates/_components/template-form";
import { toast } from "@/hooks/use-toast";
import { templateQueries, templateQueryKeys } from "@/queries/template";
import { updateTemplate } from "@/services/template";

interface EditTemplateClientProps {
  templateId: string;
}

export default function EditTemplateClient({
  templateId,
}: EditTemplateClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: template } = useQuery({
    ...templateQueries.getTemplateByIdQueryOptions(templateId),
    enabled: !!templateId,
  });

  const onSubmit = (data: TemplateFormData) => {
    console.log(data);
    if (
      !data.name ||
      !data.needleType ||
      !data.chartType ||
      !data.constructionMethods ||
      data.isPublished === undefined
    ) {
      throw new Error("모든 필드를 입력해주세요.");
    }
    updateTemplate(templateId, {
      name: data.name,
      needle_type: data.needleType,
      chart_type: data.chartType,
      construction_methods: data.constructionMethods,
      is_published: data.isPublished,
      chart_type_ids: data.chartTypeIds,
    });

    toast({
      title: "템플릿 수정 완료",
      description: "템플릿 수정이 완료되었습니다.",
    });
    queryClient.invalidateQueries({
      queryKey: templateQueryKeys.all(),
    });
    router.push(`/templates`);
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{template.name} 수정</h1>
      </div>

      {/* 탭은 임시로 제거하고 기본 정보만 표시 */}
      <div className="mt-6">
        <TemplateForm
          onSubmit={onSubmit}
          mode="EDIT"
          measurementRuleId={template.measurement_rule.id}
          category={{
            level1: template.measurement_rule.category_large,
            level2: template.measurement_rule.category_medium,
            level3: template.measurement_rule.category_small,
          }}
          initialTemplate={{
            name: template.name,
            needleType:
              template.needle_type === "NONE" ? null : template.needle_type,
            chartType:
              template.chart_type === "NONE" ? null : template.chart_type,
            constructionMethods: template.construction_methods,
            isPublished: template.is_published || false,
            // chartTypeIds: template.chart_types,
          }}
        />
      </div>
    </div>
  );
}
