"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpec } from "../../lib/spec/SpecContext";
import { Card } from "../../components/Card";
import Link from "next/link";

export default function SpecPreviewPage() {
  const { projectSpec, runGenerationPipeline, generatedConfig } = useSpec();
  const router = useRouter();

  useEffect(() => {
    if (!projectSpec) {
      router.replace("/wizard");
    }
  }, [projectSpec, router]);

  if (!projectSpec) return null;

  const handleGenerate = () => {
    runGenerationPipeline();
    router.push("/result");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link
        href="/wizard"
        className="text-xs text-slate-400 hover:text-slate-200 mb-1 inline-block"
      >
        ← Back to wizard
      </Link>
      <h1 className="text-2xl font-semibold mb-1">Spec preview</h1>
      <p className="text-sm text-slate-300 mb-2">
        This is how BuildBoss understands your project. If it looks right, generate the
        multi-agent website template.
      </p>

      <Card>
        <pre className="text-[11px] md:text-xs whitespace-pre-wrap break-all text-slate-200 bg-slate-950/70 rounded-xl p-4 overflow-x-auto">
{JSON.stringify(projectSpec, null, 2)}
        </pre>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-[11px] text-slate-400">
          {generatedConfig
            ? "A generated template already exists. You can regenerate safely."
            : "No template generated yet."}
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-slate-900 text-sm font-medium hover:opacity-90 transition"
        >
          Generate template
        </button>
      </div>
    </div>
  );
}
