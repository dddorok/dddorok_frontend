import React, { useState } from "react";

import {
  BODY_DETAIL_TYPE,
  GROUPPING_MEASUREMENT,
  MEASUREMENT,
  RETAIL_DETAIL_TYPE,
} from "./constants";

import { CommonSelect } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SEELVE_OPTIONS = ["소매 "];

export default function InformationForm() {
  const [selectedTab, setSelectedTab] = useState("몸판");
  const [activeTab, setActiveTab] = useState("case1");

  const handleProductTypeChange = (type: string) => {
    setSelectedTab(type);
    setActiveTab(type === "몸판" ? "case1" : "case2");
  };

  console.log(GROUPPING_MEASUREMENT);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Step 1. 자동운영 선택</h2>

        <div className="flex items-center space-x-2 mb-6">
          <p className="text-lg">제품군별 선택</p>
          <div className="flex ml-8 space-x-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleProductTypeChange("몸판")}
            >
              <div
                className={`w-5 h-5 rounded-full ${selectedTab === "몸판" ? "bg-black" : "border border-gray-300"} flex items-center justify-center text-white text-xs`}
              >
                ○
              </div>
              <span>몸판</span>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleProductTypeChange("소매")}
            >
              <div
                className={`w-5 h-5 rounded-full ${selectedTab === "소매" ? "bg-black" : "border border-gray-300"} flex items-center justify-center text-white text-xs`}
              >
                ○
              </div>
              <span>소매</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="case1">몸판 선택 시</TabsTrigger>
          <TabsTrigger value="case2">소매 선택 시</TabsTrigger>
        </TabsList>

        <TabsContent value="case1" className="space-y-6">
          <h3 className="text-lg font-medium">Case 1. 몸판 선택 시</h3>
          <BodyChart />
        </TabsContent>

        <TabsContent value="case2" className="space-y-6">
          <h3 className="text-lg font-medium">Case 2. 소매 선택 시</h3>
          <RetailChart />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="outline" className="px-8">
          다음
        </Button>
      </div>
    </div>
  );
}

function BodyChart() {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="몸판서브유형">몸판 세부유형 선택</Label>
          <CommonSelect
            options={BODY_DETAIL_TYPE.map((type) => ({
              label: type,
              value: type,
            }))}
            onChange={() => {}}
            placeholder="선택하세요"
            value={undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="취급점검">치수규칙 선택</Label>
          <CommonSelect
            options={[]}
            onChange={() => {}}
            placeholder="선택하세요"
            value={undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="차트이름">차트이름</Label>
          <Input id="차트이름" placeholder="자동생성, 수정가능" />
        </div>
      </div>
    </>
  );
}

function RetailChart() {
  const sleeveOptions = Object.entries(GROUPPING_MEASUREMENT).map(([key]) => ({
    label: MEASUREMENT[key as keyof typeof MEASUREMENT].측정_항목,
    value: key,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="소매서브유형">소매 서브유형 선택</Label>
        <CommonSelect
          options={RETAIL_DETAIL_TYPE.map((type) => ({
            label: type,
            value: type,
          }))}
          onChange={() => {}}
          placeholder="선택하세요"
          value={undefined}
        />
      </div>

      <div className="space-y-4">
        <Label>측정항목 선택</Label>
        <div className="grid grid-cols-2 gap-4">
          {sleeveOptions.map(({ label, value }) => (
            <div className="flex items-center space-x-2" key={value}>
              <Checkbox id={value} checked />
              <Label htmlFor={value} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="차트이름소매">차트이름</Label>
        <Input id="차트이름소매" placeholder="자동생성, 수정가능" />
      </div>
    </div>
  );
}
