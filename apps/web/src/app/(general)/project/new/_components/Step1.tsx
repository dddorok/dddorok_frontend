import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  name: string;
  gauge_ko: number;
  gauge_dan: number;
  chest_width: number;
}

export default function Step1({
  onNext,
}: {
  onNext: (data: FormData) => void;
}) {
  const [data, setData] = useState<Partial<FormData>>({
    name: "",
    gauge_ko: undefined,
    gauge_dan: undefined,
    chest_width: undefined,
  });

  const handleChange = (key: keyof typeof data, value: string) => {
    setData({ ...data, [key]: value });
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
        <div className="flex flex-col gap-[6px]">
          <Label required>게이지(10cm x 10cm 기준)</Label>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="예) 20"
                value={data.gauge_ko}
                onChange={(e) => handleChange("gauge_ko", e.target.value)}
              />
              <Label className="mb-0">코</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="예) 28"
                value={data.gauge_dan}
                onChange={(e) => handleChange("gauge_dan", e.target.value)}
              />
              <Label className="mb-0">단</Label>
            </div>
          </div>
        </div>
        <Button
          className="w-full"
          color="default"
          disabled={
            data.name === "" ||
            data.chest_width === undefined ||
            data.gauge_ko === undefined ||
            data.gauge_dan === undefined
          }
          onClick={() => onNext(data as any)}
        >
          입력 완료
        </Button>
      </div>
    </div>
  );
}
