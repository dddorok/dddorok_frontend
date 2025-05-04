import { EditChartTypeClient } from "./edit-chart-type-client";

export const metadata = {
  title: "차트 유형 수정 | 관리자 페이지",
};

export default async function EditChartTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditChartTypeClient id={id} />;
}
