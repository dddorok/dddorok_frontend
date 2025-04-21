import { notFound } from "next/navigation";

import TemplateDetailClient from "./template-detail-client";

import { templates } from "@/lib/data";

// Generate static parameters for all template IDs
export async function generateStaticParams() {
  return templates.map((template) => ({
    id: template.id,
  }));
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params to fix the error
  const { id } = await params;

  // Find template by ID
  const template = templates.find((t) => t.id === id);

  if (!template) {
    notFound();
  }

  return <TemplateDetailClient template={template} />;
}
