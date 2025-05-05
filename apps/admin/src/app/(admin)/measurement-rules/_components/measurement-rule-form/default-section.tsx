import { useQuery } from "@tanstack/react-query";
import { ComponentProps, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BasicAlert } from "@/components/Alert";
import {
  FormLabel,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, CATEGORY_ID, getCategoryById } from "@/constants/category";
import {
  NECKLINE,
  NECKLINE_OPTIONS,
  NecklineType,
  SLEEVE,
  SLEEVE_OPTIONS,
  SleeveType,
} from "@/constants/top";
import { measurementRuleQueries } from "@/queries/measurement-rule";

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
      {/* 카테고리 선택 */}
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
      <FormSelect
        name="level1"
        options={level1Categories}
        placeholder="대분류"
        onChange={() => {
          form.setValue("level2", null);
          form.setValue("level3", null);
        }}
      />
      <FormSelect
        name="level2"
        options={level2Categories}
        placeholder="중분류"
        onChange={() => form.setValue("level3", null)}
      />
      <FormSelect
        name="level3"
        options={level3Categories}
        placeholder="소분류"
        onChange={(value) => {
          form.setValue("categoryId", value);
          form.clearErrors("name");
        }}
      />
    </div>
  );
}

function FormSelect({
  options,
  label,
  placeholder,
  onChange,
  ...props
}: {
  options: { id: string; name: string }[];
  label?: string;
  placeholder?: string;
  name: ComponentProps<typeof FormField>["name"];
  onChange?: (value: string) => void;
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
                field.onBlur();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TopNeedFieldForm() {
  const form = useFormContext();
  const categoryLevel2 = useWatch({ name: "level2" });

  if (categoryLevel2 !== CATEGORY_ID.상의) return null;

  return (
    <>
      <FormSelect
        label="소매 유형"
        name="sleeveType"
        options={SLEEVE_OPTIONS.map((type) => ({
          id: type.value,
          name: type.label,
        }))}
      />
      <FormSelect
        label="넥라인"
        name="necklineType"
        options={NECKLINE_OPTIONS.map((type) => ({
          id: type.value,
          name: type.label,
        }))}
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
  const category = getCategoryById(categoryLevel3);

  const categoryLevel2 = useWatch({ name: "level2" });
  const selectedSleeveType: SleeveType = useWatch({ name: "sleeveType" });
  const selectedNecklineType: NecklineType = useWatch({ name: "necklineType" });

  const { data: measurementRulesData } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleListQueryOptions(),
  });
  const measurementRules = measurementRulesData?.data || [];
  console.log("measurementRules: ", measurementRules);

  const getAuthName = () => {
    // 자동 생성되며 수동 수정 불가
    // form.clearErrors("name");
    const category3Name = category?.name ?? null;
    switch (categoryLevel2) {
      // - 상의: `넥라인 + 소매 유형 + 소분류`
      case CATEGORY_ID.상의: {
        if (!selectedNecklineType || !selectedSleeveType || !category3Name) {
          return null;
        }
        if (selectedNecklineType === "NONE" || selectedSleeveType === "NONE") {
          return null;
        }
        return `${NECKLINE[selectedNecklineType]?.label ?? ""} ${SLEEVE[selectedSleeveType]?.label ?? ""} ${category3Name}`;
      }
      // - 그 외: `소분류명`
      default:
        return category3Name;
    }
  };

  const authName = getAuthName();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authName]);

  return (
    <div>
      <FormLabel>규칙 이름</FormLabel>
      <p className="p-3 bg-gray-50 rounded-md border text-sm mt-1">
        {authName ?? "자동으로 생성됩니다"}
      </p>
      <FormMessage />
    </div>
  );
}
