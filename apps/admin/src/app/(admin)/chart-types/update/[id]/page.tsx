import { UpdateChartTypeClient } from "./client";

export default async function UpdateChartTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <UpdateChartTypeClient id={id} />
    </div>
  );
}
