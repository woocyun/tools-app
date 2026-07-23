import { notFound } from "next/navigation";

import { Base64Tool } from "@/components/tools/base64";
import { allTools } from "@/lib/tools";

const tool = allTools.find((t) => t.slug === "base64");

export default function Base64Page() {
  if (!tool) notFound();

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
        <p className="text-muted-foreground max-w-prose">{tool.description}</p>
      </div>

      <Base64Tool />
    </main>
  );
}
