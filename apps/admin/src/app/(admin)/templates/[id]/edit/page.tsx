import { notFound } from "next/navigation";

import EditTemplateClient from "./edit-template-client";

import { templates } from "@/lib/data";

// Generate static parameters for all template IDs
export async function generateStaticParams() {
  return templates.map((template) => ({
    id: template.id,
  }));
}

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Find template by ID

  return <EditTemplateClient templateId={id} />;
}
