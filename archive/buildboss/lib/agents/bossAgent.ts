import { ProjectSpec, TaskSpec } from "../spec/types";

export function createTasksFromSpec(spec: ProjectSpec): TaskSpec[] {
  const baseDescription =
    "Target quality is top 0.01%. Respect brand, goals, and audience strictly.";
  return [
    {
      id: "task-design",
      type: "design",
      description: baseDescription + " Design a cohesive design system.",
      inputs: { brand: spec.brand, behavior: spec.behavior },
    },
    {
      id: "task-structure",
      type: "structure",
      description: baseDescription + " Define layout tree.",
      inputs: { pages: spec.pages },
    },
    {
      id: "task-content",
      type: "content",
      description: baseDescription + " Create content blueprint.",
      inputs: { pages: spec.pages, goals: spec.goals, notes: spec.contentNotes },
    },
    {
      id: "task-code",
      type: "code",
      description: baseDescription + " Plan Next.js + Tailwind implementation.",
      inputs: { pages: spec.pages },
    },
    {
      id: "task-audit",
      type: "audit",
      description: baseDescription + " Audit and polish final configuration.",
      inputs: {},
    },
  ];
}
