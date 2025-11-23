import Link from "next/link";
import { Card } from "../components/Card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="mt-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          BuildBoss
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl">
          A meta-builder assistant that interviews you in depth, turns your answers into
          a structured spec, and runs a multi-agent style pipeline to generate a
          ready-to-run website template.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Build a website</h2>
          <p className="text-sm text-slate-300 mb-4">
            Start with a guided interview that captures goals, brand, structure, and
            behavior. Then let the Boss and agents do the heavy lifting.
          </p>
          <Link
            href="/wizard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-slate-900 text-sm font-medium hover:opacity-90 transition"
          >
            Start website wizard
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">How it works</h2>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Deep interview → normalized project spec.</li>
            <li>Boss agent → tasks for design, structure, content, code, and audit.</li>
            <li>Specialized agents produce a cohesive, premium template.</li>
            <li>Audit pass polishes structure, UX, and implementation notes.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
