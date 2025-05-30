import { UpdateChartTypeClient } from "./client";

export default function UpdateChartTypePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <UpdateChartTypeClient id={params.id} />
    </div>
  );
}
