"use client";
import { useState } from "react";

import CommonLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PaymentPage() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const isDisabled = data.name === "" || data.phone === "" || data.email === "";
  return (
    <CommonLayout className="bg-neutral-N200">
      <div className="py-[64px] grid grid-cols-[1fr_512px] gap-8">
        <PaymentInfo data={data} setData={setData} />
        <MembershipPayment isDisabled={isDisabled} />
      </div>
    </CommonLayout>
  );
}

function PaymentInfo({
  data,
  setData,
}: {
  data: { name: string; phone: string; email: string };
  setData: (data: { name: string; phone: string; email: string }) => void;
}) {
  return (
    <div className="bg-neutral-N0 px-12 py-6 flex flex-col gap-8">
      <h2 className="text-h3 text-neutral-N900 text-center">구독 정보 입력</h2>
      <section className="flex flex-col gap-4">
        <h3 className="text-medium text-neutral-N1000 font-bold">
          구매자 정보
        </h3>
        <div className="flex flex-col gap-[2px]">
          <Label>구매자명 *</Label>
          <Input
            placeholder="이름을 입력해주세요"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <Label>전화번호 *</Label>
          <Input
            placeholder="010 0000 0000"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <Label>이메일 주소</Label>
          <Input
            placeholder="abc@naver.com"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
      </section>

      <div className="p-3 rounded-[6px] text-system-Success text-xsmall bg-[#34C75917] leading-4">
        * 이용 요금의 결제
        <br />
        서비스 이용 결제는 이용자가 등록한 신용 또는 체크카드를 통한 선불결제를
        원칙으로 합니다.
        <br />
        플랜의 계약 및 정기 과금의 시작일 산정 기준은 구독 신청일 (계약 시작일)
        입니다. 단, 특정 월에 결제일이 존재하지 않는 경우, 해당 월에 한하여
        말일에 과금일이 부여되기 때문에 유동적일 수 있습니다.
        <br />
        지정된 계약 만료일이 도래하기 전 이용자가 해지 신청을 하지 않을 경우,
        해당 플랜의 계약 기간 단위로 계약의 자동 연장이 이루어집니다.
        <br />
        <br />
        * 이용 계약의 환불 및 해지 정책
        <br />
        계약 기간 중 나의 멤버십 페이지에서 서비스의 해지 신청을 할 수 있습니다.
        <br />
        결제 후 콘텐츠 이용 내역이 없을 경우, 결제일로부터 7일 이내 환불이
        가능합니다.
        <br />
        해지 신청을 할 경우 해당 회차까지의 사용은 유지되며, 다음 회차부터
        해지가 적용됩니다. 이로 인해 해당 회차의 종료일 익일(즉, 다음회차의
        정기과금일)부터 서비스를 사용하실 수 없습니다.
        <br />
        <br />
        * 결제 실패 시의 대응
        <br />
        정기 과금일 당일 내에 신청/사용중인 플랜에 대해 등록된 카드로 결제가
        자동으로 이루어집니다.
        <br />
        결제에 실패할 경우, 등록된 카드 정보로 +4일까지 매일 주기적으로 재결제를
        시도합니다.
        <br />
        위 지정한 기간까지 재결제에 실패할 경우, 해당 회차의 사용은 즉시
        중지되며 계약 중도 해지로 간주합니다.
        <br />
        <br />
        이용 요금의 변경
        <br />
        서비스의 이용 요금에 대해 회사는 일시적으로 추가 할인을 제공하거나 이를
        종료할 수 있습니다. <br />
        이용요금이 과금 기준에 따라 변경(재산정)되는 경우 최소 7일 전에
        이용자에게 안내합니다. 
        <br />
        서비스 이용요금 과금 방식의 변경사항이 발생한 경우 사전 30일 전
        웹사이트를 통해 이를 공지합니다. 이미 계약된 기간 동안은 추가로 비용을
        청구하거나 환불하지 않습니다. <br />
      </div>

      {/* 쿠폰 */}
      {/* <section className="flex flex-col gap-4">
        <h3 className="text-medium text-neutral-N1000 font-bold">
          쿠폰/할인 정보
        </h3>
        <div className="flex flex-col gap-[2px]">
          <Label>쿠폰</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="쿠폰/할인 정보" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">쿠폰없음</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section> */}

      {/* <section className="flex flex-col gap-4">
        <h3 className="text-medium text-neutral-N1000 font-bold">결제 정보</h3>
        <div className="flex flex-col gap-[12px]">
          <Label>결제 수단 선택 *</Label>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center gap-2 border border-neutral-N200 rounded-[4px] h-[48px]">
              <Checkbox checked={true} /> 체크 및 신용카드
            </div>
            <div className="flex items-center justify-center gap-2 border border-neutral-N200 rounded-[4px] h-[48px]">
              <Checkbox disabled checked={false} /> 무통장 입금
            </div>
          </div>

          <div className="p-3 rounded-[6px] text-system-Success text-xsmall bg-[#34C75917]">
            결제 정보는 SSL 프로토콜로 안전하게 전송됩니다. <br />
            뜨도록은 카드 정보를 서버에 저장하지 않습니다.
          </div>
        </div>
        <div className="flex flex-col gap-[12px]">
          <Label>카드 번호 *</Label>
          <Input placeholder="‘-’ 생략하고 입력" />
        </div>
        <div className="flex flex-col gap-[12px]">
          <Label>유효기간</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="월" />
            <Input placeholder="년" />
          
          </div>
        </div>
        <div className="flex flex-col gap-[12px]">
          <Label>카드 비밀번호 앞 2자리 *</Label>
          <div className="flex items-center gap-4">
            <Input className="w-[76px]" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
            >
              <circle cx="3" cy="3" r="3" fill="#343844" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
            >
              <circle cx="3" cy="3" r="3" fill="#343844" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-[2px]">
          <Label>생년월일 6자리(법인의 경우, 사업자 번호 10자리) *</Label>
          <Input placeholder="‘-’ 생략하고 입력" />
        </div>
      </section> */}
    </div>
  );
}

function MembershipPayment({ isDisabled }: { isDisabled: boolean }) {
  return (
    <div className="bg-neutral-N0 px-8 py-6 flex flex-col gap-8">
      <h2 className="text-h3 text-neutral-N900 text-center">
        멤버십 구독 결제
      </h2>

      <div className="bg-neutral-N100 p-4 rounded-[6px] text-medium text-neutral-N900">
        <div className="flex justify-between">
          <span className="font-medium">3개월 멤버십 이용권 금액</span>
          <span className="text-small text-neutral-N700">11,700 원</span>
        </div>

        {/* <div className="flex justify-between mt-2 mb-5">
          <span className="font-medium">쿠폰 할인 금액</span>
          <span className="text-small text-neutral-N700">-0 원</span>
        </div> */}

        <hr className="mb-4 mt-5" />

        <div className="flex justify-between">
          <span className="font-medium text-large">결제금액</span>
          <span className="text-lead">
            <strong className="text-primary-PR-darker">11,700</strong> 원
          </span>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="weeklyContent" />
          <label
            htmlFor="weeklyContent"
            className="text-medium text-neutral-N600"
          >
            주문 내용을 확인했으며, 아래 내용에 모두 동의합니다.
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="personalInfo" />
          <label
            htmlFor="personalInfo"
            className="text-medium text-neutral-N600"
          >
            (필수) 개인정보 수집/이용 동의
          </label>
          <button>보기</button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="thirdParty" />
          <label htmlFor="thirdParty" className="text-medium text-neutral-N600">
            (필수) 개인정보 제3자 제공 동의
          </label>
          <button>보기</button>
        </div>
      </div> */}

      <Button color="fill" disabled={isDisabled}>
        멤버십 결제
      </Button>
    </div>
  );
}
