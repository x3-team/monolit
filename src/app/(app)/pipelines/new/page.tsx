import { PipelineBuilder } from "@/components/pipeline-builder";

export default function NewPipelinePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl">New pipeline</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Configure schema fields and integration targets.
        </p>
      </div>
      <PipelineBuilder />
    </div>
  );
}
