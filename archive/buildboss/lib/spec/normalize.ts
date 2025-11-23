import { ProjectSpec } from "./types";

export type WizardFormValues = {
  projectType: "website";
  goals: string;
  targetAudience: string;
  brandName: string;
  brandTagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typographyStyle: string;
  imageryStyle: string;
  pages: string;
  sectionsNotes: string;
  contentNotes: string;
  forms: string;
  integrations: string;
  animations: string;
  accessibilityNotes: string;
  extraPreferences: string;
};

function parseList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeToProjectSpec(values: WizardFormValues): ProjectSpec {
  const goals = parseList(values.goals);
  const pageNames = parseList(values.pages);
  const forms = parseList(values.forms);
  const integrations = parseList(values.integrations);

  const pages = pageNames.map((name, index) => {
    const route =
      index === 0
        ? "/"
        : "/" +
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    return {
      id: `page-${index}`,
      name,
      route,
      sections: [
        {
          id: `sec-${index}-hero`,
          type: "hero" as const,
          notes: values.sectionsNotes || "Hero section tailored to page purpose.",
        },
        {
          id: `sec-${index}-features`,
          type: "features" as const,
          notes: "Key benefits or features for this page.",
        },
        {
          id: `sec-${index}-cta`,
          type: "cta" as const,
          notes: "Clear call-to-action aligned with page goal.",
        },
      ],
    };
  });

  return {
    projectType: "website",
    goals: goals.length ? goals : ["Explain offering", "Convert visitors"],
    targetAudience: values.targetAudience || "General audience",
    brand: {
      name: values.brandName || "Untitled Brand",
      tagline: values.brandTagline || "A tagline that clearly states your value.",
      colors: {
        primary: values.primaryColor || "#7c3aed",
        secondary: values.secondaryColor || "#0f172a",
        accent: values.accentColor || "#22d3ee",
      },
      typographyStyle: values.typographyStyle || "modern, clean, sans-serif",
      imageryStyle: values.imageryStyle || "clean, minimal imagery with subtle gradients",
    },
    pages,
    contentNotes: values.contentNotes || "",
    functionality: {
      forms: forms.length ? forms : ["contact"],
      integrations,
    },
    behavior: {
      animations: values.animations || "subtle",
      accessibilityNotes: values.accessibilityNotes || "aim for WCAG AA basics",
    },
    extraPreferences: values.extraPreferences || "",
  };
}
