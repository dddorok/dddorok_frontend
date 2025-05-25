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

export default function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="">
      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-[6px]">
          <Label className="text-small">프로젝트명 *</Label>
          <Input type="text" />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label className="text-small">프로젝트명 *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="가슴둘레를 선택해주세요." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">가슴둘레</SelectItem>
              <SelectItem value="banana">게이지</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label className="text-small">게이지(10cm x 10cm 기준) *</Label>
          <div className="grid grid-cols-2 gap-6">
            <Input type="text" placeholder="예) 20" />
            <Input type="text" placeholder="예) 28" />
          </div>
        </div>
        <Button className="w-full" color="fill" onClick={onNext}>
          입력 완료
        </Button>
      </div>
    </div>
  );
}
