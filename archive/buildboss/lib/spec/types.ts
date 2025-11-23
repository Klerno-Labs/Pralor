export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "custom";

export type ProjectSpecPageSection = {
  id: string;
  type: SectionType;
  notes: string;
};

export type ProjectSpecPage = {
  id: string;
  name: string;
  route: string;
  sections: ProjectSpecPageSection[];
};

export type ProjectSpec = {
  projectType: "website";
  goals: string[];
  targetAudience: string;
  brand: {
    name: string;
    tagline: string;
    colors: { primary: string; secondary?: string; accent?: string };
    typographyStyle: string;
    imageryStyle: string;
  };
  pages: ProjectSpecPage[];
  contentNotes: string;
  functionality: {
    forms: string[];
    integrations: string[];
  };
  behavior: {
    animations: string;
    accessibilityNotes: string;
  };
  extraPreferences: string;
};

export type TaskType = "design" | "structure" | "content" | "code" | "audit";

export type TaskSpec = {
  id: string;
  type: TaskType;
  description: string;
  inputs: unknown;
};

export type DesignSystem = {
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    style: string;
    scale: string[];
  };
  layout: {
    maxWidth: string;
    sectionSpacing: string;
    borderRadius: string;
  };
  components: {
    cardStyle: string;
    buttonStyle: string;
    sectionStyle: string;
  };
};

export type LayoutTree = {
  pages: Array<{
    id: string;
    name: string;
    route: string;
    sections: Array<{
      id: string;
      type: SectionType;
      component: string;
    }>;
  }>;
};

export type ContentBlueprint = {
  pages: Array<{
    id: string;
    name: string;
    route: string;
    sections: Array<{
      id: string;
      type: SectionType;
      headline: string;
      body: string;
      cta?: string;
    }>;
  }>;
};

export type ImplementationPlan = {
  pages: string[];
  components: string[];
  notes: string;
};

export type AuditFinding = {
  id: string;
  severity: "info" | "warning" | "suggestion";
  message: string;
};

export type GeneratedWebsiteConfig = {
  spec: ProjectSpec;
  designSystem: DesignSystem;
  layoutTree: LayoutTree;
  contentBlueprint: ContentBlueprint;
  implementationPlan: ImplementationPlan;
  auditFindings: AuditFinding[];
};
