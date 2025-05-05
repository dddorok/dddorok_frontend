import EditTemplateClient from "./edit-template-client";

// Generate static parameters for all template IDs
export async function generateStaticParams() {
  // return templates.map((template) => ({
  //   id: template.id,
  // }));
}

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditTemplateClient templateId={id} />;
}
