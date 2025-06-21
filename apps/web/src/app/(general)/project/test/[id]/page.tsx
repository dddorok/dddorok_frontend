import ProjectDetailClient from "./client";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsData = await params;
  console.log("project: ", paramsData);
  return <ProjectDetailClient id={paramsData.id} />;
}
