import ChartPageClient from "./client";

export default async function ChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsData = await params;
  return <ChartPageClient id={paramsData.id} />;
}
