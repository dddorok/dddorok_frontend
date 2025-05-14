import NewTemplateClient from "./new-template-client";

export default async function NewTemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ ruleId?: string }>;
}) {
  const ruleId = (await searchParams).ruleId;
  return <NewTemplateClient initRuleId={ruleId} />;
}
