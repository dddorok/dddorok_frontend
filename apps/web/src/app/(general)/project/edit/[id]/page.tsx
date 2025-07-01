import { ProjectEditClient } from "./client";

export default async function DotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditClient id={id} />;
}
