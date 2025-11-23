import { LayoutTree, ProjectSpec, TaskSpec } from "../spec/types";

export function runStructureAgent(spec: ProjectSpec, _task: TaskSpec): LayoutTree {
  return {
    pages: spec.pages.map((page) => ({
      id: page.id,
      name: page.name,
      route: page.route,
      sections: page.sections.map((s) => ({
        id: s.id,
        type: s.type,
        component: mapSectionTypeToComponent(s.type),
      })),
    })),
  };
}

function mapSectionTypeToComponent(type: string): string {
  switch (type) {
    case "hero":
      return "HeroSection";
    case "features":
      return "FeaturesSection";
    case "testimonials":
      return "TestimonialsSection";
    case "pricing":
      return "PricingSection";
    case "faq":
      return "FaqSection";
    case "cta":
      return "CtaSection";
    default:
      return "CustomSection";
  }
}
