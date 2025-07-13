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

const INITIAL_DATA = {
  name: "",
  gauge_ko: undefined,
  gauge_dan: undefined,
  chest_width: undefined,
  gauge_tab: "gauge_manual",
} as const;

const COMMON_GAUGE_DATA = {
  gauge_ko: 20,
  gauge_dan: 28,
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
            defaultValue={"85"}
          >
            <SelectTrigger>
              {data.chest_width ? (
                <div className="text-neutral-N900">
                  {
                    CHEST_WIDTH_OPTIONS.find(
                      (option) => option.value == data.chest_width
                    )?.label
                  }
                </div>
              ) : (
                <div className="text-neutral-N400">
                  가슴둘레를 선택해주세요.
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              {CHEST_WIDTH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
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

const CHEST_WIDTH_OPTIONS = [
  { value: 50, label: "50-53 cm" },
  { value: 54, label: "54-57 cm" },
  { value: 58, label: "58-61 cm (5세)" },
  { value: 62, label: "62-65 cm (7세)" },
  { value: 66, label: "66-69 cm (9세)" },
  { value: 70, label: "70-73 cm" },
  { value: 74, label: "74-79 cm" },
  { value: 80, label: "80-84 cm" },
  { value: 85, label: "85-89 cm (여 XS)" },
  { value: 90, label: "90-94 cm (여 S)" },
  { value: 95, label: "95-99 cm (여 M)" },
  { value: 100, label: "100-104 cm (여 L)" },
  { value: 105, label: "105-109 cm (여 XL)" },
  { value: 110, label: "110-114 cm (여 XXL)" },
  { value: 115, label: "115-119 cm " },
  { value: 120, label: "120-124 cm" },
];
