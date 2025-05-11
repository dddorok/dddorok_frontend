import React, { useState } from "react";

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

export default function InformationForm({ onNext }: { onNext: () => void }) {
  const [selectedTab, setSelectedTab] = useState("물판");
  const [activeTab, setActiveTab] = useState("case1");

  const handleProductTypeChange = (type: string) => {
    setSelectedTab(type);
    setActiveTab(type === "물판" ? "case1" : "case2");
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Step 1. 자동운영 선택</h2>

        <div className="flex items-center space-x-2 mb-6">
          <p className="text-lg">제품군별 선택</p>
          <div className="flex ml-8 space-x-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleProductTypeChange("물판")}
            >
              <div
                className={`w-5 h-5 rounded-full ${selectedTab === "물판" ? "bg-black" : "border border-gray-300"} flex items-center justify-center text-white text-xs`}
              >
                ○
              </div>
              <span>물판</span>
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
          <TabsTrigger value="case1">물판 선택 시</TabsTrigger>
          <TabsTrigger value="case2">소매 선택 시</TabsTrigger>
        </TabsList>

        <TabsContent value="case1" className="space-y-6">
          <h3 className="text-lg font-medium">Case 1. 물판 선택 시</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="물판서브유형">물판 서브유형 선택</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">유형 1</SelectItem>
                  <SelectItem value="type2">유형 2</SelectItem>
                  <SelectItem value="type3">유형 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="취급점검">취급점검 선택</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check1">점검 1</SelectItem>
                  <SelectItem value="check2">점검 2</SelectItem>
                  <SelectItem value="check3">점검 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="차트이름">차트이름</Label>
              <Input id="차트이름" placeholder="자동생성, 수정가능" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="case2" className="space-y-6">
          <h3 className="text-lg font-medium">Case 2. 소매 선택 시</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="소매서브유형">소매 서브유형 선택</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail1">소매 유형 1</SelectItem>
                  <SelectItem value="retail2">소매 유형 2</SelectItem>
                  <SelectItem value="retail3">소매 유형 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>측정항목 선택</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="소매건수" checked />
                  <Label htmlFor="소매건수" className="cursor-pointer">
                    소매건수
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="소매금액" checked />
                  <Label htmlFor="소매금액" className="cursor-pointer">
                    소매금액
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="소매평단가" checked />
                  <Label htmlFor="소매평단가" className="cursor-pointer">
                    소매평단가
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="소매취소율" checked />
                  <Label htmlFor="소매취소율" className="cursor-pointer">
                    소매취소율
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="소매환불건" />
                  <Label htmlFor="소매환불건" className="cursor-pointer">
                    소매 환불건
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="차트이름소매">차트이름</Label>
              <Input id="차트이름소매" placeholder="자동생성, 수정가능" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={onNext} className="px-8">
          다음
        </Button>
      </div>
    </div>
  );
}
