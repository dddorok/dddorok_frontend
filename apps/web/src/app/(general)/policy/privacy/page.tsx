import React from "react";

import CommonLayout from "@/components/layout/MainLayout";

export default function PrivacyPage() {
  return (
    <CommonLayout>
      <div className="py-12">
        <h1 className="text-h3 mb-5 text-center font-semibold">
          뜨도록 개인정보처리빙침
        </h1>
        <PrivacyPolicy />
      </div>
    </CommonLayout>
  );
}

const Table = ({
  headers,
  rows,
  className = "",
}: {
  headers: string[];
  rows: string[][];
  className?: string;
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((header, index) => (
            <th
              key={index}
              className="border border-gray-300 px-4 py-2 text-left font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PrivacyPolicy = () => {
  const purposeTableData = {
    headers: ["구분", "목적"],
    rows: [
      [
        "회원 가입 및 관리(필수)",
        "회원 가입의사 확인, 이용자 식별 및 본인여부, 회원자격 유지·관리, 계약 이행 및 약관변경 고지를 위한 연락, 본인의사 확인 및 민원 처리, 부정이용 방지, 비인가 사용방지, 서비스 제공 및 계약의 이행, 서비스 이용 및 상담, 문의, 후기를 위한 원활한 의사소통 경로 확보, 맞춤형 서비스 제공, 메시지 발송",
      ],
      [
        "서비스 제공 및 향상(필수)",
        "만족도 조사, 멘토 신규 기관 연결, 맞춤형 서비스 제공, 콘텐츠 제공, 본인인증, 연령인증, 요금결제, 정산, 환불처리, 기존 서비스 개선을 위한 분석",
      ],
      [
        "유료 서비스 제공(필수)",
        "계약의 체결·유지·이행·관리, 요금 결제, 정산 및 금융 거래 본인인증, 구매 및 요금 결제, 서비스 이용",
      ],
      [
        "자동 생성 또는 수집(필수)",
        "서비스방문 및 이용기록 분석, 부정이용 방지를 위한 기록 관리, 앱 서비스 이용자 식별, 이용자의 관심, 흥미, 기호, 성향에 기반한 사용 데이터 분석, 서비스 이용 실적 통계 분석, 이용 편의성 개선",
      ],
      [
        "메시지 및 이메일 발송(필수)",
        "분쟁 조정, 고객문의 대응 및 법령 준수 이력 증빙",
      ],
      [
        "이용자 보호 및 서비스 운영(필수)",
        "법령 및 이용약관을 위반하는 회원에 대한 이용 제한 조치, 부정이용 행위 방지 및 제재, 계정 도용 및 부정거래 방지, 약관 개정 등의 고지사항 전달, 분쟁 조정을 위한 기록 보존, 민원 처리",
      ],
      [
        "마케팅 및 광고(선택)",
        "웹 페이지 접속빈도 파악 및 회원의 서비스 이용에 대한 통계, 이벤트 정보 및 참여 기회 제공, 신규 서비스 소개, 광고성 정보 제공, CRM, 맞춤형 광고/혜택/상품 추천, 마케팅 활동",
      ],
    ],
  };

  const collectionTableData = {
    headers: [
      "목적",
      "구분",
      "개인정보 항목(필수)",
      "개인정보 항목(선택)",
      "수집방법",
    ],
    rows: [
      ["회원가입", "SNS 가입", "공통: 이름, 이메일", "-", "홈페이지"],
      [
        "서비스 이용 및 제공",
        "템플릿 추천을 위한 회원 상세 정보",
        "-",
        "생년월일, 뜨개 숙련도, 소속",
        "홈페이지",
      ],
      [
        "서비스 이용 및 제공",
        "정산",
        "이름, 연락처, 휴대폰번호, 계좌번호",
        "-",
        "홈페이지",
      ],
      [
        "서비스 이용 및 제공",
        "정산",
        "통장사본, 계좌번호, 주민등록번호, 주민등록증(근거법령: 소득세법 제145조 및 제164조, 시행령 제193조 및 제213조)*",
        "-",
        "홈페이지",
      ],
      [
        "자동 생성 또는 수집",
        "-",
        "서비스 이용기록, 방문기록, 불량 이용기록, 앱 사용이력, IP주소, 쿠키, MAC주소, 브라우저 종류, 모바일 기기정보(앱 버전, OS 버전, Device ID), ADID/IDFA(광고식별자), 상품 검색/클릭 이력, 주문설정, 구매이력(주문 상품 및 금액), 멤버십 구독/해지 여부, 페이지 노출 이력, 이벤트 참여 이력",
        "-",
        "홈페이지",
      ],
      [
        "메시지 발송",
        "-",
        "이메일, 문자, 알림톡 발송이력(이름, 아이디, 휴대폰 번호, 이메일)",
        "-",
        "홈페이지",
      ],
      [
        "부정이용 방지",
        "재가입 제한",
        "아이디, 휴대폰 번호, 이메일",
        "-",
        "홈페이지",
      ],
      [
        "부정이용 방지",
        "부정이용 재발 방지",
        "부정 이용자의 이름, 휴대폰 번호, 이메일 주소, 주소, 배송정보(이름, 휴대폰 번호, 주소), Device ID, 부정이용 기록",
        "-",
        "홈페이지",
      ],
    ],
  };

  const retentionTableData = {
    headers: ["항목", "목적", "보유기간"],
    rows: [
      [
        "이름, 이메일, 휴대폰번호, 계좌번호, 카드번호",
        "서비스 구독 및 지출 내역 증빙",
        "5년",
      ],
      [
        "서비스 이용 및 방문 기록, 단말 정보(Device ID), 구매이력(주문 상품 및 금액), 상품 검색/클릭 이력, 광고식별자",
        "이용자의 관심, 흥미, 기호, 성향에 기반한 사용 데이터 분석, 서비스 이용 실적 통계 분석, 이용 편의성 개선, 맞춤형 광고/혜택/상품 추천 및 서비스 제공",
        "수집일로부터 2년",
      ],
      [
        "이메일, 문자, 알림톡 발송이력(이름, 아이디, 휴대폰 번호, 이메일)",
        "분쟁 조정, 고객문의 대응 및 법령 준수 이력 증빙",
        "발송일로부터 최대 2년 (이메일: 2년, 문자 및 알림톡: 6개월)",
      ],
      [
        "아이디, 휴대폰 번호, 이메일",
        "재가입 등의 방법을 이용한 부정이용 방지",
        "회원탈퇴 후 3개월",
      ],
      [
        "부정 이용자의 이름, 휴대폰 번호, 이메일 주소, 주소, 배송정보(이름, 휴대폰 번호, 주소), Device ID, 부정이용 기록",
        "부정이용 재발 방지",
        "회원탈퇴 후 1년",
      ],
    ],
  };

  const delegationTableData = {
    headers: ["수탁자", "위탁업무", "재수탁자 및 재위탁업무"],
    rows: [
      ["Amazon Web Services, Inc.", "데이터 보관", "-"],
      ["메가존클라우드㈜", "AWS 서비스 운영", "-"],
      [
        "Google Analytics4",
        "이용자의 서비스 이용 통계 분석 (쿠키/이용로그 수집 및 리포팅)",
        "-",
      ],
      ["페이플㈜", "결제 처리 대행", "-"],
    ],
  };

  const supportTableData = {
    headers: ["문의처", "연락처", "홈페이지"],
    rows: [
      ["개인정보침해신고센터", "(국번없이) 118", "privacy.kisa.or.kr"],
      ["개인정보분쟁조정위원회", "1833-6972", "http://www.kopico.go.kr/"],
      ["대검찰청 사이버수사과", "(국번없이) 1301", "http://www.spo.go.kr/"],
      [
        "경찰청 사이버범죄 신고시스템(ECRM)",
        "(국번없이) 182",
        "http://ecrm.cyber.go.kr/minwon/main",
      ],
    ],
  };

  return (
    <div className="text-medium font-medium">
      <p className="mb-6">
        <span>
          바인드오프(이하 "회사")는 「개인정보 보호법」제30조에 따라 이용자에게
          개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한
          고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
          개인정보 처리방침을 수립・공개합니다.
        </span>
      </p>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-4 text-primary-PR-darker">
          1. 개인정보의 수집 및 이용 목적
        </h2>
        <p className="mb-4">
          회사는 다음의 목적을 위하여 최소한의 개인정보를 수합니다. 처리하고
          있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
          목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할
          예정입니다.
        </p>

        <Table {...purposeTableData} className="mb-6" />
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          2. 개인정보의 수집 항목 및 방법
        </h2>
        <Table {...collectionTableData} className="mb-6" />
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          3. 개인정보의 보유 및 이용기간
        </h2>
        <p className="mb-4">
          회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당
          정보를 지체 없이 파기합니다. 다만, 다음의 정보에 대해서는 아래 명시한
          기간 동안 보존합니다.
        </p>

        <h3 className="font-semibold mb-3">가. 회사 내부 방침에 의한 보존</h3>
        <Table {...retentionTableData} className="mb-6 " />

        <h3 className="font-semibold mb-3">나. 법령에 따른 보존</h3>
        <p className="mb-4">
          관계 법령에 따라 일정 기간 정보 보관 의무가 있는 경우, 회사는 해당
          기간 동안 개인정보를 보관합니다. 이 경우 보존하는 정보는 보존
          목적으로만 이용하며 기간 경과 후 파기합니다. 주요 법령별 보존기간은
          다음과 같습니다:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-2">
            <li>
              <span>전자상거래법</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>- 계약 또는 청약철회 등에 관한 기록: 5년 보관</li>
                <li>- 대금결제 및 재화 등의 공급에 관한 기록: 5년 보관</li>
                <li>- 소비자의 불만 또는 분쟁처리에 관한 기록: 5년 보관</li>
              </ul>
            </li>
            <li>
              <span>전자금융거래법</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>- 전자금융 거래에 관한 기록: 5년 보관</li>
              </ul>
            </li>
            <li>
              <span>통신비밀보호법</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>- 로그인 기록(서비스 접속기록, 접속IP 등): 3개월 보관</li>
              </ul>
            </li>
            <li>
              <span>국세기본법 등</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  - 세법이 규정하는 모든 거래에 관한 장부 및 증빙자료: 5년 보관
                  (해당되는 경우)
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-4 text-sm">
            위에 명시되지 않은 사항은 관련 법령이 정한 바를 따릅니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          4. 개인정보의 제3자 제공
        </h2>
        <p className="mb-4">
          회사는 원칙적으로 이용자의 개인정보를 본 방침에서 명시한 범위를
          초과하여 이용하거나 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는
          예외로 합니다.
        </p>
        <ul className="space-y-2 mb-4">
          <li>
            • 이용자가 사전에 동의한 경우: 제휴 서비스 이용 등 특정 목적을 위해
            이용자에게 설명 후 동의를 구한 경우. (예: 창작자 수익정산을 위해
            정산 대행사에 이름/계좌정보 제공 등 별도 동의 받은 경우)
          </li>
          <li>
            • 법령에 특별한 규정이 있거나, 수사 목적으로 법령에 따른 절차와
            방법으로 수사기관의 요구가 있는 경우: 이 경우도 관련 법령에 근거하여
            최소한의 정보만 제공하며, 가능하다면 이용자에게 사후
            통지합니다(법적으로 통지 금지된 경우 제외).
          </li>
          <li>
            • 서비스 이용에 따른 거래 이행을 위하여 필요한 최소한의 정보가
            전달되는 경우
          </li>
          <li>
            • 합병, 인수 등 기업 거래 상황에서 개인정보 이전이 필요한 경우: 이
            경우 개인정보보호법이 정한 절차에 따라 이용자 동의 또는 고지 후
            개인정보가 안전하게 이전될 수 있도록 조치합니다.
          </li>
        </ul>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm">
            ※ 현재 회사는 이용자의 개인정보를 정기적으로 제공하고 있는 외부
            제3자는 없습니다. 만약 향후 제휴사 등에게 개인정보 제공이 발생할
            경우, 제공받는 자, 목적, 항목, 보유기간 등을 서비스 공지 및 본 방침
            개정을 통해 사전 고지하고 동의를 받겠습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          5. 개인정보처리의 위탁
        </h2>
        <p className="mb-4">
          회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
          처리업무를 위탁하고 있습니다.
        </p>

        <Table {...delegationTableData} className="mb-6" />

        <p>
          회사는 위탁계약 체결 시 개인정보의 안전한 관리를 위해 수탁자에 대한
          개인정보보호 교육, 기술적 보호조치 의무 부과, 재위탁 제한 등의 사항을
          명시하고 관리∙감독합니다. 수탁자가 변경되거나 추가될 경우 사전에
          공지하겠습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          6. 이용자 및 법정대리인의 권리와 그 행사방법
        </h2>

        <h3 className="font-semibold mb-3">가. 이용자의 권리</h3>
        <p className="mb-4">
          이용자는 언제든지 자신의 개인정보에 대해 다음과 같은 권리를 행사할 수
          있습니다:
        </p>
        <ul className="space-y-2 mb-6">
          <li>
            • <span>개인정보 열람 요구:</span> 회사가 보관 중인 자신의
            개인정보에 대해 열람을 요청할 수 있습니다. 단, 열람요구권은 법령에서
            열람을 금지하거나 제한한 경우에는 제한될 수 있습니다.
          </li>
          <li>
            • <span>개인정보 정정∙삭제 요구:</span> 부정확하거나 오류가 있는
            정보에 대해서는 정정을 요구할 수 있고, 수집 목적 달성 등 특정 사유에
            해당하면 삭제를 요청할 수 있습니다. 다만 관련 법령에서 보관 의무가
            있는 정보는 삭제 요청이 제한될 수 있습니다.
          </li>
          <li>
            • <span>개인정보 처리정지 요구:</span> 개인정보의 처리에 관한 동의를
            철회하거나 일시 정지를 요구할 수 있습니다. 예를 들어, 뉴스레터
            수신동의 철회, 프로파일링 거부 등이 이에 해당합니다. 다만 서비스
            제공에 필수적인 정보 처리(예: 회원 인증 정보)는 정지 요청 시 서비스
            이용에 제약이 있을 수 있습니다.
          </li>
        </ul>

        <h3 className="font-semibold mb-3">나. 권리 행사방법</h3>
        <ul className="space-y-2 mb-6">
          <li>
            • 위 권리 행사는 서비스 내 개인정보 관리 메뉴를 통한 직접 신청이나,
            고객센터 문의를 통해 하실 수 있습니다. 회사는 본인 확인을 위해
            신분증 등 확인을 요청할 수 있으며, 본인 또는 정당한 대리인임이
            확인된 경우 지체 없이 필요한 조치를 취하겠습니다.
          </li>
          <li>
            • 이용자에 따른 권리 행사는 이용자의 법정대리인이나 위임을 받은 자
            등 대리인을 통하여 하실 수 있습니다. 이 경우 위임장을 제출하셔야
            합니다.
          </li>
          <li>
            • 회사는 이용자 권리에 따른 요청을 받으면 요청일로부터 10일 이내에
            조치를 완료하고 그 결과를 통지해 드립니다. 만약 일부 또는 전부
            거절하게 되는 경우 정당한 이유와 거절 근거를 함께 안내해
            드리겠습니다.
          </li>
          <li>
            • 개인정보의 오류에 대한 정정을 요청하신 경우, 정정을 완료하기
            전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된
            개인정보를 이미 제3자에게 제공한 경우에는 정정 처리결과를 제3자에게
            통지하여 정정이 이루어지도록 하겠습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          7. 개인정보의 파기절차 및 방법
        </h2>
        <p className="mb-4">
          회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가
          불필요하게 되었을 때에는 지체 없이 해당 정보를 파기합니다. 파기 절차
          및 방법은 다음과 같습니다.
        </p>
        <ul className="space-y-2 mb-6">
          <li>
            • <span>파기절차:</span> 회원이 회원탈퇴를 하거나 개인정보 수집 및
            이용목적이 달성되면, 내부 방침 및 기타 관련 법령에 의한 정보 보유
            사유(제3항 참조)에 따라 일정 기간 저장된 후 삭제 또는 파기됩니다. 이
            기간 동안 해당 개인정보는 법령에 정한 경우가 아니고서는 보유 이외의
            다른 목적으로 이용되지 않습니다.
          </li>
          <li>
            • <span>파기방법:</span> 전자적 파일 형태의 정보는 복구 또는 재생이
            불가능한 방법(예: 안전한 디스크 삭제 기술, DB 삭제 후 덮어쓰기 등)을
            사용하여 영구 삭제합니다. 종이에 출력된 개인정보는 분쇄하거나
            소각하여 파기합니다.
          </li>
          <li>
            • <span>미이용자 개인정보 분리보관/파기:</span> 1년 이상 서비스에
            로그인하지 않은 이용자의 개인정보는 다른 회원의 개인정보와 분리하여
            저장∙관리하고(휴면계정 처리), 분리 보관 후 4년 경과 시 파기합니다.
            휴면 전환 30일 전까지 이메일 등을 통해 해당 사실을 통지하며,
            휴면계정 전환을 원하지 않으면 로그인 등의 방법으로 활성 상태를
            유지할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          8. 개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항
        </h2>

        <h3 className="font-semibold mb-3">가. 쿠키(Cookie)의 사용</h3>
        <p className="mb-4">
          회사는 이용자에게 보다 빠르고 편리한 웹서비스를 제공하고자 쿠키를
          사용할 수 있습니다. 쿠키는 웹사이트 서버가 이용자의 브라우저에 보내는
          작은 데이터 파일로서, 이용자가 웹사이트에 재방문할 때 읽어 설정정보
          등을 불러오는데 사용됩니다.
        </p>
        <ul className="space-y-2 mb-6">
          <li>
            • <span>쿠키 사용 목적:</span> 이용자가 방문한 각 서비스와 웹
            사이트들에 대한 방문 및 이용형태, 로그인 유지, 사용자 설정 저장 등에
            쿠키 정보를 활용합니다. 또한 방문자 분석을 위해 구글 애널리틱스
            등에서 쿠키를 통해 트래픽 데이터를 수집할 수 있습니다.
          </li>
          <li>
            • <span>쿠키의 설치∙운영 및 거부:</span> 이용자는 쿠키 저장을
            거부하거나, 이미 저장된 쿠키를 삭제할 수 있습니다. 브라우저 설정에서
            쿠키 허용을 선택 해제하거나 개별 쿠키 삭제를 하면 됩니다. (설정
            방법: 예시 – Internet Explorer의 경우 도구 &gt; 인터넷 옵션 &gt;
            개인정보 &gt; 고급에서 쿠키 차단 설정 가능. Chrome의 경우 설정 &gt;
            개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터에서 제어 가능.)
            다만 쿠키 저장을 거부할 경우 로그인이 필요한 서비스 이용에 어려움이
            발생할 수 있고, 맞춤 서비스 제공에 제한이 있을 수 있습니다.
          </li>
        </ul>

        <h3 className="font-semibold mb-3">나. 기타 자동 수집 기술</h3>
        <p className="mb-6">
          회사는 모바일 앱에서 디바이스 아이디, 광고식별자 (ADID/IDFA) 등을
          수집할 수 있습니다. 이러한 식별자는 이용자의 기기를 구분하기 위한
          정보로, 맞춤형 광고 제공 및 사용성 개선에 활용됩니다. 이용자는 모바일
          기기 설정에서 광고식별자 수집을 제한하거나 초기화할 수 있습니다. 또한
          서비스 안정성과 품질 개선을 위해 Crash 리포트, 사용 빈도 통계 등이
          수집될 수 있으며, 이 역시 개인 식별 정보는 포함하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          9. 개인정보의 안전성 확보 조치
        </h2>
        <p className="mb-4">
          회사는 이용자의 개인정보를 안전하게 관리하기 위해 기술적/관리적/물리적
          조치를 다음과 같이 시행하고 있습니다:
        </p>
        <ul className="space-y-2">
          <li>
            • <span>관리적 조치:</span> 내부관리계획 수립 시행, 정기적 직원 교육
            등
          </li>
          <li>
            • <span>기술적 조치:</span> 개인정보처리시스템 등의 접근권한 관리,
            접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치 등
          </li>
          <li>
            • <span>물리적 조치:</span> 전산실, 자료보관실 등의 접근통제 등
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          10. 개인정보 보호책임자
        </h2>
        <p className="mb-4">
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의
          개인정보 관련 문의에 신속히 대응하기 위하여 아래와 같이 개인정보
          보호책임자를 지정하고 있습니다.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">개인정보 보호책임자</h3>
          <ul className="space-y-1">
            <li>• 성명: 김수지</li>
            <li>• 직책/직급: 대표자</li>
            <li>• 연락처: 이메일 admin@dddorok.com / 전화 010-3541-5248</li>
          </ul>
        </div>

        <p>
          이용자는 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
          불만 처리, 피해 구제 등에 관한 사항을 개인정보 보호책임자 및
          담당부서로 문의할 수 있습니다. 회사는 최대한 신속하고 충분한 답변을
          드리겠습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          11. 이용자의 권익침해에 대한 구제방법
        </h2>
        <p className="mb-4">
          개인정보 침해에 대한 도움이 필요하시거나 상담이 필요하시면 아래 기관에
          문의하실 수 있습니다.
        </p>

        <p className="mb-4 text-sm">
          ※ 아래의 기관은 회사와는 별개의 기관으로서, 회사의 자체적인 개인정보
          불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이
          필요하시면 문의하여 주시기 바랍니다.
        </p>

        <Table {...supportTableData} className="mb-6" />
      </section>

      <section className="mb-8">
        <h2 className="text-large font-semibold mb-2 text-primary-PR-darker">
          12. 개인정보처리방침의 개정과 공지
        </h2>
        <p className="mb-4">
          본 개인정보 처리방침을 개정할 경우에는 홈페이지 등을 통해 변경 내용을
          공지하도록 하겠습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">시행일자: 2025년 05월 18일</p>
        </div>
      </section>
    </div>
  );
};
