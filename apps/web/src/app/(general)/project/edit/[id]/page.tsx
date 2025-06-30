import { ProjectEditClient } from "./client";
import chartDummyData from "./generated_chart.json";
// import KnittingPatternEditor from "./knitting";

export default function DotPage({ params }: { params: { id: string } }) {
  return <ProjectEditClient id={params.id} />;
}
