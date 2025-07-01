import { ProjectClient } from "./client";

export default async function DotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectClient id={id} />;
}
