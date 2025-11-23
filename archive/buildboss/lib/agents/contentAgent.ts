import {
  ContentBlueprint,
  ProjectSpec,
  TaskSpec,
  SectionType,
} from "../spec/types";

export function runContentAgent(spec: ProjectSpec, _task: TaskSpec): ContentBlueprint {
  return {
    pages: spec.pages.map((page, pageIndex) => ({
      id: page.id,
      name: page.name,
      route: page.route,
      sections: page.sections.map((section, sectionIndex) => {
        const baseTitle = buildHeadlineForSection(
          section.type,
          spec.brand.name,
          page.name,
        );
        const body = buildBodyForSection(
          section.type,
          spec,
          pageIndex,
          sectionIndex,
        );
        const cta =
          section.type === "hero" || section.type === "cta"
            ? "Get started today"
            : undefined;
        return {
          id: section.id,
          type: section.type,
          headline: baseTitle,
          body,
          cta,
        };
      }),
    })),
  };
}

function buildHeadlineForSection(
  type: SectionType,
  brandName: string,
  pageName: string,
): string {
  switch (type) {
    case "hero":
      return `${brandName}: ${pageName} that actually converts`;
    case "features":
      return "What you get out of the box";
    case "testimonials":
      return "Loved by people who care about quality";
    case "pricing":
      return "Simple pricing, no surprises";
    case "faq":
      return "Questions, answered clearly";
    case "cta":
      return "Ready to launch your site?";
    default:
      return pageName;
  }
}

function buildBodyForSection(
  type: SectionType,
  spec: ProjectSpec,
  _pageIndex: number,
  _sectionIndex: number,
): string {
  const goalsSnippet = spec.goals.join(", ");
  switch (type) {
    case "hero":
      return `Designed for ${spec.targetAudience}, focused on ${goalsSnippet}. Crafted to feel premium, confident, and clear.`;
    case "features":
      return "Highlight the 3–5 core benefits that matter most to your visitors. Keep each feature sharp, outcome-focused, and easy to scan.";
    case "testimonials":
      return "Drop in a few short, specific quotes from real users or clients with names and roles.";
    case "pricing":
      return "Present 2–3 pricing options max, with one clearly recommended plan. Be explicit about what's included.";
    case "faq":
      return "Answer the questions people actually ask: pricing, guarantees, support, timelines.";
    case "cta":
      return "Give visitors one clear next step and tell them exactly what they'll get when they click.";
    default:
      return spec.contentNotes || "Additional supporting content tailored to this page.";
  }
}
