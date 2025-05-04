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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_ID,
  SLEEVE_TYPES,
  NECKLINE_TYPES,
  getCategoryById,
  categories,
} from "@/lib/data";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

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
        options={SLEEVE_TYPES.map((type) => ({
          id: type,
          name: type,
        }))}
      />
      <FormSelect
        label="넥라인"
        name="necklineType"
        options={NECKLINE_TYPES.map((type) => ({
          id: type,
          name: type,
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
  const selectedSleeveType = useWatch({ name: "sleeveType" }) ?? "";
  const selectedNecklineType = useWatch({ name: "necklineType" }) ?? "";

  const getAuthName = () => {
    // 자동 생성되며 수동 수정 불가
    // form.clearErrors("name");
    const category3Name = category?.name ?? "";
    switch (categoryLevel2) {
      // - 상의: `넥라인 + 소매 유형 + 소분류`
      case CATEGORY_ID.상의: {
        return `${selectedNecklineType} ${selectedSleeveType} ${category3Name}`;
      }
      // - 그 외: `소분류명`
      default:
        return category3Name;
    }
  };

  const authName = getAuthName();

  useEffect(() => {
    form.setValue("name", authName);
  }, [authName]);

  return (
    <FormField
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>규칙 이름</FormLabel>
          <FormControl>
            <Input {...field} readOnly placeholder="자동으로 생성됩니다" />
          </FormControl>
          <FormDescription>
            소매 유형과 카테고리를 선택하면 자동으로 설정됩니다.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
