export default function TaQuestionLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-4 px-4 py-10" aria-busy="true">
      <div className="h-8 w-2/3 rounded bg-background-elevated" />
      <div className="h-4 w-full rounded bg-background-elevated" />
      <div className="h-40 w-full rounded bg-background-elevated" />
    </div>
  );
}
