export default function OAuthRedirect({
  searchParams,
}: {
  searchParams: { provider: string; code: string; state: string };
}) {
  console.log("searchParams: ", searchParams);
  const provider = searchParams.provider;
  const code = searchParams.code;
  const state = searchParams.state;

  return <div>OAuthRedirect</div>;
}
