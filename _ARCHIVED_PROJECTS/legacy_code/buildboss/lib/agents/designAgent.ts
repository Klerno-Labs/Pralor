import { DesignSystem, ProjectSpec, TaskSpec } from "../spec/types";

export function runDesignAgent(spec: ProjectSpec, _task: TaskSpec): DesignSystem {
  const { colors } = spec.brand;
  return {
    palette: {
      primary: colors.primary || "#7c3aed",
      secondary: colors.secondary || "#020617",
      accent: colors.accent || "#22d3ee",
    },
    typography: {
      style: spec.brand.typographyStyle,
      scale: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"],
    },
    layout: {
      maxWidth: "max-w-6xl",
      sectionSpacing: "py-16",
      borderRadius: "rounded-2xl",
    },
    components: {
      cardStyle:
        "bg-card/90 border border-slate-800/70 shadow-xl shadow-black/40 rounded-2xl p-8",
      buttonStyle:
        "inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-accent text-sm font-medium text-slate-900 hover:opacity-90 transition",
      sectionStyle: "w-full",
    },
  };
}
