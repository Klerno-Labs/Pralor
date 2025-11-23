"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpec } from "../../lib/spec/SpecContext";
import { Card } from "../../components/Card";
import { GeneratedSitePreview } from "../../components/generated/sections";

type Tab = "preview" | "notes" | "audit";

export default function ResultPage() {
  const { generatedConfig } = useSpec();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("preview");

  useEffect(() => {
    if (!generatedConfig) {
      router.replace("/spec-preview");
    }
  }, [generatedConfig, router]);

  if (!generatedConfig) return null;

  const { spec, designSystem, layoutTree, contentBlueprint, implementationPlan, auditFindings } =
    generatedConfig;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link
        href="/spec-preview"
        className="text-xs text-slate-400 hover:text-slate-200 mb-1 inline-block"
      >
        ← Back to spec
      </Link>
      <h1 className="text-2xl font-semibold mb-1">Generated website template</h1>
      <p className="text-sm text-slate-300 mb-2">
        This is the result of the Boss + agents + audit pipeline. You can preview the
        homepage, inspect notes, and review the audit.
      </p>

      <div className="flex gap-2 text-xs mb-3">
        <button
          onClick={() => setTab("preview")}
          className={`px-3 py-1.5 rounded-full border ${
            tab === "preview"
              ? "border-accent bg-accent/10 text-slate-50"
              : "border-slate-700 text-slate-300"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("notes")}
          className={`px-3 py-1.5 rounded-full border ${
            tab === "notes"
              ? "border-accent bg-accent/10 text-slate-50"
              : "border-slate-700 text-slate-300"
          }`}
        >
          Developer notes
        </button>
        <button
          onClick={() => setTab("audit")}
          className={`px-3 py-1.5 rounded-full border ${
            tab === "audit"
              ? "border-accent bg-accent/10 text-slate-50"
              : "border-slate-700 text-slate-300"
          }`}
        >
          Audit findings
        </button>
      </div>

      {tab === "preview" && (
        <Card>
          <GeneratedSitePreview
            design={designSystem}
            layout={layoutTree}
            content={contentBlueprint}
          />
        </Card>
      )}

      {tab === "notes" && (
        <Card>
          <div className="space-y-3 text-sm text-slate-200">
            <div>
              <h2 className="text-base font-semibold mb-1">Project snapshot</h2>
              <p className="text-slate-300">
                <span className="font-medium">{spec.brand.name}</span> —{" "}
                {spec.brand.tagline}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Goals: {spec.goals.join(", ") || "Not specified"}
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1">Implementation plan</h2>
              <p className="text-[11px] text-slate-300 mb-1">
                Pages (routes): {implementationPlan.pages.join(", ")}
              </p>
              <p className="text-[11px] text-slate-300 mb-1">
                Components: {implementationPlan.components.join(", ")}
              </p>
              <p className="text-[11px] text-slate-400">
                {implementationPlan.notes}
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1">Design system</h2>
              <p className="text-[11px] text-slate-300">
                Palette: primary {designSystem.palette.primary}, secondary{" "}
                {designSystem.palette.secondary}, accent{" "}
                {designSystem.palette.accent}.
              </p>
              <p className="text-[11px] text-slate-300">
                Typography: {designSystem.typography.style}.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1">How to use this template</h2>
              <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1">
                <li>Run <code>npm install</code> then <code>npm run dev</code>.</li>
                <li>
                  Tweak the spec and pipeline logic in <code>lib/spec</code> and{" "}
                  <code>lib/agents</code>.
                </li>
                <li>
                  Customize sections in{" "}
                  <code>components/generated/sections.tsx</code>.
                </li>
                <li>
                  When ready, deploy using your favorite Next.js host (Vercel, Netlify,
                  etc.).
                </li>
              </ol>
            </div>
          </div>
        </Card>
      )}

      {tab === "audit" && (
        <Card>
          <h2 className="text-base font-semibold mb-2">Audit / QA findings</h2>
          {auditFindings.length === 0 && (
            <p className="text-sm text-slate-300">
              No issues detected in this pass. You can still manually review accessibility,
              performance, and content tone.
            </p>
          )}
          {auditFindings.length > 0 && (
            <ul className="space-y-2 text-sm">
              {auditFindings.map((f) => (
                <li
                  key={f.id}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-0.5">
                    {f.severity}
                  </div>
                  <div className="text-slate-100 text-xs">{f.message}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
