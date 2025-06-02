import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import {
  GetMeasurementRuleItemCodeResponse,
  VALUE_TYPE_LABEL,
  ValueType,
} from "@/services/measurement-rule";

const 제외_측정_코드 = [
  "BODY_TOTAL_LENGTH",
  "BODY_ARM_HOLE_LENGTH",
  "SLEEVE_SLEEVE_CAP_LENGTH",
];

interface MeasurementRuleSelectSectionProps {
  selectedItems: string[];
  onChange: (items: string[]) => void;
}

export function MeasurementRuleSelectSection(
  props: MeasurementRuleSelectSectionProps
) {
  const { data: itemCodes } = useQuery({
    ...measurementRuleQueries.itemCode(),
    select: (data) =>
      data.filter((item) => !제외_측정_코드.includes(item.code)),
  });

  const groupedItems = transformMeasurementItems(itemCodes ?? []);
  const [activeTab, setActiveTab] = useState<string>("상의");

  // 측정 항목을 카테고리별로 그룹화
  const itemCategories = Object.keys(groupedItems);
  return (
    <FormItem>
      <Tabs
        defaultValue="상의"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 w-full justify-start gap-1 bg-muted/50 p-1 my-4">
          {itemCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-4 py-1.5"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {itemCategories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="space-y-6">
              {Object.keys(groupedItems[category] ?? {}).map((section) => {
                return (
                  <RuleCheckList
                    key={section}
                    sectionName={section}
                    sectionItems={groupedItems[category]?.[section] as any}
                    selectedItems={props.selectedItems}
                    onChange={props.onChange}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <FormMessage />
    </FormItem>
  );
}

function RuleCheckList({
  sectionItems,
  sectionName,
  onChange,
  selectedItems,
}: {
  sectionItems: GetMeasurementRuleItemCodeResponse[];
  sectionName: string;
  onChange: (items: string[]) => void;
  selectedItems: string[];
}) {
  // value_type으로 groupping
  const groupedItems = sectionItems.reduce<
    Record<string, GetMeasurementRuleItemCodeResponse[]>
  >((acc, item) => {
    if (!acc[item.value_type]) {
      acc[item.value_type] = [];
    }
    acc[item.value_type]?.push(item);
    return acc;
  }, {});

  // 아이템 선택 처리
  const handleItemChange = (itemCode: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedItems, itemCode]);
    } else {
      onChange(selectedItems.filter((code: string) => code !== itemCode));
    }
  };

  // 섹션 항목들이 모두 선택되었는지 확인
  const isSectionFullySelected = () => {
    return sectionItems.every((item) => selectedItems.includes(item.code));
  };

  // 섹션 항목들이 일부 선택되었는지 확인
  const isSectionPartiallySelected = () => {
    const selectedCount = sectionItems.filter((item) =>
      selectedItems.includes(item.code)
    ).length;
    return selectedCount > 0 && selectedCount < sectionItems.length;
  };

  // 섹션의 모든 항목 선택/해제
  const handleSectionSelectAll = (selected: boolean) => {
    if (selected) {
      // 섹션 항목 모두 추가 (중복 제거)
      const sectionItemIds = sectionItems.map((item) => item.code);
      onChange([...new Set([...selectedItems, ...sectionItemIds])]);
    } else {
      // 섹션 항목 모두 제거
      const sectionItemIds = sectionItems.map((item) => item.code);
      onChange(
        selectedItems.filter((code: string) => !sectionItemIds.includes(code))
      );
    }
  };

  const isFullySelected = isSectionFullySelected();
  const isPartiallySelected = isSectionPartiallySelected();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`section-${sectionName}`}
          checked={isFullySelected}
          className={isPartiallySelected ? "opacity-70" : ""}
          onCheckedChange={(checked) => handleSectionSelectAll(!!checked)}
        />
        <label
          htmlFor={`section-${sectionName}`}
          className="font-semibold text-gray-700"
        >
          {sectionName}
        </label>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-2 pl-4">
        {Object.keys(groupedItems).map((valueType) => (
          <div key={valueType}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {VALUE_TYPE_LABEL[valueType as ValueType] ?? valueType}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 pl-4">
              {groupedItems[valueType]?.map((item) => (
                <RuleCheckItem
                  key={item.code}
                  checked={selectedItems.includes(item.code)}
                  item={item}
                  onClick={(checked) => handleItemChange(item.code, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleCheckItem({
  checked,
  item,
  onClick,
}: {
  checked: boolean;
  item: GetMeasurementRuleItemCodeResponse;
  onClick: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        id={`item-${item.code}`}
        checked={checked}
        onCheckedChange={(checked) => onClick(!!checked)}
        className="mt-0.5"
      />
      <div>
        <label
          htmlFor={`item-${item.code}`}
          className="font-medium leading-none cursor-pointer"
        >
          {item.label}
        </label>
      </div>
    </div>
  );
}

interface TransformedMeasurementItems {
  [category: string]: {
    [section: string]: GetMeasurementRuleItemCodeResponse[];
  };
}

function transformMeasurementItems(
  items: GetMeasurementRuleItemCodeResponse[]
): TransformedMeasurementItems {
  return items.reduce<TransformedMeasurementItems>((acc, item) => {
    const { category, section } = item;

    if (!acc[category]) {
      acc[category] = {};
    }

    if (!acc[category][section]) {
      acc[category][section] = [];
    }

    acc[category][section].push(item);

    return acc;
  }, {});
}
