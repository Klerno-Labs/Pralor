import {
  ImplementationPlan,
  LayoutTree,
  DesignSystem,
  ContentBlueprint,
  ProjectSpec,
  TaskSpec,
} from "../spec/types";

export function runCodeAgent(
  spec: ProjectSpec,
  _task: TaskSpec,
  layout: LayoutTree,
  _design: DesignSystem,
  _content: ContentBlueprint,
): ImplementationPlan {
  const pages = layout.pages.map((p) => p.route || "/");
  const components = Array.from(
    new Set(layout.pages.flatMap((p) => p.sections.map((s) => s.component))),
  );

  const notes = [
    "App uses Next.js App Router with a dark, premium theme.",
    "Each section type maps to a reusable React component in components/generated/sections.tsx.",
    "Pages are rendered dynamically from GeneratedWebsiteConfig.",
    spec.extraPreferences
      ? `Extra preferences to consider in customization: ${spec.extraPreferences}`
      : "You can further customize styling, content, and layout in the config and components.",
  ].join(" ");

  return {
    pages,
    components,
    notes,
  };
}
