import { useQuery } from "@tanstack/react-query";
import { CheckIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { LargeTab } from "@/components/common/tab/LargeTab";
import { RadioGroup } from "@/components/common/tab/radio/RadioGroup";
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
import { projectQueries } from "@/queries/project";

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

const useGetInitialProjectName = (templateName: string) => {
  const { data: myProjectList } = useQuery({
    ...projectQueries.myProjectList(),
  });

  const getInitialName = () => {
    if (!myProjectList) {
      return null;
    }
    return `${templateName}-${myProjectList?.length + 1}`;
  };

  return getInitialName() ?? "";
};

export default function Step1({
  onNext,
  templateName,
}: {
  onNext: (data: FormData) => void;
  templateName: string;
}) {
  const initialProjectName = useGetInitialProjectName(templateName);

  const [data, setData] = useState<Partial<FormData>>({
    ...INITIAL_DATA,
  });

  useEffect(() => {
    setData({ ...data, name: initialProjectName });
  }, [initialProjectName]);

  const isButtonDisabled = Object.values(data).some((value) => !value);

  const handleChange = (key: keyof typeof data, value: string) => {
    setData({ ...data, [key]: value });
  };

  const handleGaugeTabChange = (tab: GaugeTabType) => {
    if (tab === "gauge_manual") {
      setData({ ...data, gauge_tab: tab });
    } else {
      setData({ ...data, gauge_tab: tab, ...COMMON_GAUGE_DATA });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // - 글자수 : 최소 3자~최대 20자 이내
    // - 영문/한글/숫자 조합 가능, 특수문자 불가
    // - 디폴트값 : title1 (번호는 사용자가 생성한 프로젝트 수 조회해서 입력되도록 함
    // if (value.length > 10) {
    //   return;
    // }
    handleChange("name", value);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-[6px]">
          <Label required>프로젝트명</Label>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => handleNameChange(e)}
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label required>가슴둘레</Label>
          <Select
            value={data.chest_width?.toString()}
            onValueChange={(value) => handleChange("chest_width", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="가슴둘레를 선택해주세요."
                className="data-[placeholder]:text-neutral-N400 aaaaa"
              />
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
          <RadioGroup
            options={[
              {
                id: "gauge_manual",
                label: "게이지 직접 입력",
                content: (
                  <div className="grid grid-cols-2 gap-6 mt-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="예) 20"
                        value={data.gauge_ko}
                        onChange={(e) =>
                          handleChange("gauge_ko", e.target.value)
                        }
                        disabled={data.gauge_tab !== "gauge_manual"}
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
                        disabled={data.gauge_tab !== "gauge_manual"}
                      />
                      <Label className="mb-0">단</Label>
                    </div>
                  </div>
                ),
              },
              {
                id: "gauge_after",
                label: "게이지 임의 입력",
                content: (
                  <div className="rounded-sm mt-3 hidden grid-cols-[12px_1fr]  gap-2 group-data-[selected=true]/option:grid ">
                    <InfoIcon className="w-[12px] h-[12px] text-neutral-N400" />
                    <div className="text-xsmall text-neutral-N500">
                      게이지를 아직 측정하지 않으셨나요?
                      <br />
                      임의 게이지로 먼저 시작해보세요.
                    </div>
                  </div>
                ),
              },
            ]}
            defaultValue={data.gauge_tab}
            value={data.gauge_tab}
            onChange={(value) => handleGaugeTabChange(value as GaugeTabType)}
          />
          {data.gauge_tab === "gauge_manual" && (
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
          )}
        </div>
        <Button
          className="w-full"
          color="white"
          disabled={isButtonDisabled}
          onClick={() => onNext(data as FormData)}
        >
          입력 완료
        </Button>
      </div>
    </div>
  );
}
