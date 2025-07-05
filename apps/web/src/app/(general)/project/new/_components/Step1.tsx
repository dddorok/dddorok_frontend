import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { LargeTab } from "@/components/common/tab/LargeTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEV_DUMMY_DATA = {
  name: "test",
  gauge_ko: 20,
  gauge_dan: 28,
  chest_width: 85,
  gauge_tab: "gauge_manual",
} as const;

const INITIAL_DATA = {
  name: "",
  gauge_ko: undefined,
  gauge_dan: undefined,
  chest_width: undefined,
  gauge_tab: "gauge_manual",
} as const;

const COMMON_GAUGE_DATA = {
  gauge_ko: 28,
  gauge_dan: 20,
} as const;

type GaugeTabType = "gauge_manual" | "gauge_after";

export interface FormData {
  name: string;
  gauge_ko: number;
  gauge_dan: number;
  chest_width: number;
  gauge_tab: GaugeTabType;
}

export default function Step1({
  onNext,
}: {
  onNext: (data: FormData) => void;
}) {
  const [data, setData] = useState<Partial<FormData>>(
    process.env.NODE_ENV === "development" ? DEV_DUMMY_DATA : INITIAL_DATA
  );

  const isButtonDisabled = Object.values(data).some((value) => !value);

  const handleChange = (key: keyof typeof data, value: string) => {
    setData({ ...data, [key]: value });
  };

  const handleGaugeTabChange = (tab: GaugeTabType) => {
    if (tab === "gauge_manual") {
      setData({ ...data, gauge_ko: undefined, gauge_dan: undefined });
    } else {
      setData({ ...data, gauge_tab: tab, ...COMMON_GAUGE_DATA });
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-[6px]">
          <Label required>프로젝트명</Label>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label required>가슴둘레</Label>
          <Select
            value={data.chest_width?.toString()}
            onValueChange={(value) => handleChange("chest_width", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="가슴둘레를 선택해주세요." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="85">80-85 cm</SelectItem>
              <SelectItem value="90">85-90 cm</SelectItem>
              <SelectItem value="95">90-95 cm</SelectItem>
              <SelectItem value="100">95-100 cm</SelectItem>
              <SelectItem value="105">100-105 cm</SelectItem>
              <SelectItem value="110">105-110 cm</SelectItem>
              <SelectItem value="115">110-115 cm</SelectItem>
              <SelectItem value="120">115-120 cm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label required>게이지(10cm x 10cm 기준)</Label>
          <LargeTab<GaugeTabType>
            tabs={[
              {
                id: "gauge_manual",
                label: (
                  <>
                    <CheckIcon className="w-[14px] h-[14px]" />
                    직접 입력하기
                  </>
                ),
                content: (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="예) 20"
                          value={data.gauge_ko}
                          onChange={(e) =>
                            handleChange("gauge_ko", e.target.value)
                          }
                        />
                        <Label className="mb-0">코</Label>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="예) 28"
                          value={data.gauge_dan}
                          onChange={(e) =>
                            handleChange("gauge_dan", e.target.value)
                          }
                        />
                        <Label className="mb-0">단</Label>
                      </div>
                    </div>
                    <div className="px-1 py-2 bg-neutral-N100 rounded-sm mt-3 grid grid-cols-[12px_1fr] gap-2">
                      <div className="text-xsmall">✔️</div>
                      <div className="text-xsmall text-neutral-N500">
                        일반적인 손뜨개 게이지 (10x10cm 기준)
                        <br />
                        <ul>
                          <li>기본 실(4ply): 22~24코 × 30~34단</li>
                          <li>굵은 실(Chunky): 14~16코 × 20~24단</li>
                          <li>얇은 실(Fingering): 28~32코 × 36~40단</li>
                        </ul>
                      </div>
                    </div>
                  </>
                ),
              },
              {
                id: "gauge_after",
                label: (
                  <>
                    <CheckIcon className="w-[14px] h-[14px]" />
                    나중에 등록하기
                  </>
                ),
                content: (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="예) 20"
                          value={data.gauge_ko}
                          onChange={(e) =>
                            handleChange("gauge_ko", e.target.value)
                          }
                        />
                        <Label className="mb-0">코</Label>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="예) 28"
                          value={data.gauge_dan}
                          onChange={(e) =>
                            handleChange("gauge_dan", e.target.value)
                          }
                        />
                        <Label className="mb-0">단</Label>
                      </div>
                    </div>
                    <div className="px-1 py-2 bg-neutral-N100 rounded-sm mt-3 grid grid-cols-[12px_1fr] gap-2">
                      <div className="text-xsmall">✔️</div>
                      <div className="text-xsmall text-neutral-N500">
                        일반적인 손뜨개 게이지 (10x10cm 기준)
                        <br />
                        <ul>
                          <li>기본 실(4ply): 22~24코 × 30~34단</li>
                          <li>굵은 실(Chunky): 14~16코 × 20~24단</li>
                          <li>얇은 실(Fingering): 28~32코 × 36~40단</li>
                        </ul>
                      </div>
                    </div>
                  </>
                ),
              },
            ]}
            defaultTabId="gauge_manual"
            onTabChange={(tab) => handleGaugeTabChange(tab as GaugeTabType)}
          />
        </div>
        <Button
          className="w-full"
          color="default"
          disabled={isButtonDisabled}
          onClick={() => onNext(data as FormData)}
        >
          입력 완료
        </Button>
      </div>
    </div>
  );
}
