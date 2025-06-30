import { ProjectClient } from "./client";

export default function DotPage({ params }: { params: { id: string } }) {
  return <ProjectClient id={params.id} />;
}
