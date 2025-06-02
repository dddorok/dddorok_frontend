/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ChartTypeSelect } from "../../_components/ChartTypeSelect";
import { DeleteTemplateButton } from "../../_components/template-list";
import { ImageUpload } from "../../ImageUpload";

import { CommonInputField } from "@/components/CommonFormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { templateQueries, templateQueryKeys } from "@/queries/template";
import {
  GetTemplateByIdResponse,
  updateTemplate,
  uploadThumbnail,
} from "@/services/template/template";

interface EditTemplateClientProps {
  templateId: string;
}

export default function EditTemplateClient({
  templateId,
}: EditTemplateClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: template } = useQuery({
    ...templateQueries.detail(templateId),
    enabled: !!templateId,
  });

  const onSubmit = async (
    data: TemplateFormData,
    newImageFile: File | null
  ) => {
    if (!template) return;
    console.log("data: ", data);

    let resourceId: string | null = null;

    if (newImageFile) {
      resourceId = await uploadThumbnail(newImageFile);
    }

    await updateTemplate(templateId, {
      ...template,
      name: data.name,
      chart_type_maps: data.chartTypeMaps,
      resourceId: resourceId,
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
        <TemplateEditForm template={template} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

type TemplateFormData = {
  name: string;
  chartTypeMaps: {
    chart_type_id: string;
    order: number;
  }[];
};

function TemplateEditForm({
  template,
  onSubmit,
}: {
  template: GetTemplateByIdResponse;
  onSubmit: (data: TemplateFormData, file: File | null) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<TemplateFormData>({
    defaultValues: {
      name: template.name,
      chartTypeMaps: template.chart_types.map((chartType) => ({
        chart_type_id: chartType.id,
        order: chartType.order,
      })),
    },
  });

  const handleSubmit = (data: TemplateFormData) => {
    onSubmit(data, file);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보 수정</CardTitle>
            <CardDescription>
              템플릿의 기본 정보를 수정해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommonInputField name="name" label="템플릿명" />
          </CardContent>
        </Card>
        <TemplateImage
          thumbnailUrl={template.thumbnail_url}
          file={file}
          setFile={setFile}
        />
        <ChartTypeSelect chartTypeMapsName="chartTypeMaps" />
        <div className="flex justify-end gap-4">
          <DeleteTemplateButton templateId={template.id} buttonSize="default" />
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            저장
          </Button>
        </div>
      </div>
    </Form>
  );
}

function TemplateImage({
  thumbnailUrl,
  file,
  setFile,
}: {
  thumbnailUrl: GetTemplateByIdResponse["thumbnail_url"];
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing || file) {
    return (
      <>
        <ImageUpload
          file={file}
          setFile={(file) => {
            setFile(file);
          }}
          onRemove={() => setFile(null)}
        />
      </>
    );
  }

  if (!isEditing && thumbnailUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>이미지 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[200px] overflow-hidden">
            <img
              src={thumbnailUrl}
              alt="thumbnail"
              className="h-[200px] object-contain"
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ImageUpload
      file={file}
      setFile={(file) => {
        setFile(file);
        setIsEditing(false);
      }}
      onRemove={() => setFile(null)}
    />
  );
}
