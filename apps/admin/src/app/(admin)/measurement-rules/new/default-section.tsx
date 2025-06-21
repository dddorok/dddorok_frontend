import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BasicAlert } from "@/components/Alert";
import { CommonSelectField } from "@/components/CommonFormField";
import { FormLabel, FormDescription } from "@/components/ui/form";
import { categories, CATEGORY_ID, getCategoryById } from "@/constants/category";
import {
  NECKLINE_OPTIONS,
  NecklineType,
  SLEEVE_OPTIONS,
  SleeveType,
} from "@/constants/top";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { 치수규칙_이름_셍성 } from "@/utils/naming";

export function MeasurementRuleDefaultSection() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      {form.formState.errors.name && (
        <BasicAlert title="중복 오류" variant="destructive">
          선택한 카테고리와 소매 유형의 조합으로 이미 치수 규칙이 존재합니다.
          다른 조합을 선택해주세요.
        </BasicAlert>
      )}

      <div className="space-y-4">
        <div>
          <FormLabel>카테고리 선택</FormLabel>
          <FormDescription>
            대분류, 중분류, 소분류를 순서대로 선택해주세요.
          </FormDescription>
        </div>
        <CategorySelect />
      </div>

      <TopNeedFieldForm />

      <MeasurementRuleName />
    </div>
  );
}

function CategorySelect() {
  const form = useFormContext();

  const level1 = useWatch({ name: "level1" });
  const level2 = useWatch({ name: "level2" });

  // 대-중-소 카테고리 리스트
  const level1Categories = categories.filter((cat) => cat.parent_id === null);
  const level2Categories =
    level1Categories.find((cat) => cat.id == level1)?.children || [];
  const level3Categories =
    level2Categories.find((cat) => cat.id === level2)?.children || [];

  return (
    <div className="grid grid-cols-3 gap-4">
      <CommonSelectField
        name="level1"
        options={level1Categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))}
        placeholder="대분류"
        onChange={() => {
          form.setValue("level2", null);
          form.setValue("level3", null);
        }}
      />
      <CommonSelectField
        name="level2"
        options={level2Categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))}
        placeholder="중분류"
        onChange={() => form.setValue("level3", null)}
      />
      <CommonSelectField
        name="level3"
        options={level3Categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))}
        placeholder="소분류"
        onChange={(value) => {
          form.setValue("categoryId", value);
          form.clearErrors("name");
        }}
      />
    </div>
  );
}

function TopNeedFieldForm() {
  const categoryLevel2 = useWatch({ name: "level2" });

  if (categoryLevel2 !== CATEGORY_ID.상의) return null;

  return (
    <>
      <CommonSelectField
        label="소매 유형"
        placeholder="소매 유형 선택"
        name="sleeveType"
        options={SLEEVE_OPTIONS}
      />
      <CommonSelectField
        label="넥라인"
        placeholder="넥라인 선택"
        name="necklineType"
        options={NECKLINE_OPTIONS}
      />
    </>
  );
}

/**
 * 자동 생성되는 규칙 이름 표시
 */
function MeasurementRuleName() {
  const form = useFormContext();

  const categoryLevel3 = useWatch({ name: "level3" });
  const categoryLevel2 = useWatch({ name: "level2" });
  const selectedSleeveType: SleeveType = useWatch({ name: "sleeveType" });
  const selectedNecklineType: NecklineType = useWatch({ name: "necklineType" });

  const category = getCategoryById(categoryLevel3);

  const { data: measurementRulesData } = useQuery({
    ...measurementRuleQueries.list(),
  });
  const measurementRules = measurementRulesData?.data || [];

  const authName = 치수규칙_이름_셍성({
    categoryLevel2,
    sleeveType: selectedSleeveType,
    necklineType: selectedNecklineType,
    category3Name: category?.name ?? "",
  });

  // TODO: name field는 제거 가능 할 듯
  useEffect(() => {
    if (measurementRules.find((rule) => rule.rule_name === authName)) {
      form.setError("name", {
        message: "이미 존재하는 규칙 이름입니다.",
      });
    } else {
      form.clearErrors("name");
    }
    form.setValue("name", authName);
  }, [authName]);

  return (
    <div className="space-y-2">
      <FormLabel>규칙 이름</FormLabel>
      <p className="p-3 bg-gray-50 rounded-md border text-sm mt-1">
        {authName ?? "자동으로 생성됩니다"}
      </p>
    </div>
  );
}
