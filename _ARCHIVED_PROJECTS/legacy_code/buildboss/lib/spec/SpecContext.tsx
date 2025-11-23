"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { WizardFormValues } from "./normalize";
import { normalizeToProjectSpec } from "./normalize";
import type { GeneratedWebsiteConfig, ProjectSpec } from "./types";
import { generateWebsiteFromSpec } from "../pipeline/generateWebsite";

type SpecContextValue = {
  wizardValues: WizardFormValues;
  setWizardValues: (values: WizardFormValues) => void;
  projectSpec: ProjectSpec | null;
  generateSpec: () => void;
  generatedConfig: GeneratedWebsiteConfig | null;
  runGenerationPipeline: () => void;
};

const defaultWizardValues: WizardFormValues = {
  projectType: "website",
  goals: "",
  targetAudience: "",
  brandName: "",
  brandTagline: "",
  primaryColor: "",
  secondaryColor: "",
  accentColor: "",
  typographyStyle: "",
  imageryStyle: "",
  pages: "Home, About, Features, Pricing, Contact",
  sectionsNotes: "",
  contentNotes: "",
  forms: "contact",
  integrations: "",
  animations: "subtle",
  accessibilityNotes: "",
  extraPreferences: "",
};

const SpecContext = createContext<SpecContextValue | undefined>(undefined);

export function SpecProvider({ children }: { children: ReactNode }) {
  const [wizardValues, setWizardValuesState] = useState<WizardFormValues>(
    defaultWizardValues,
  );
  const [projectSpec, setProjectSpec] = useState<ProjectSpec | null>(null);
  const [generatedConfig, setGeneratedConfig] =
    useState<GeneratedWebsiteConfig | null>(null);

  const setWizardValues = (values: WizardFormValues) => {
    setWizardValuesState(values);
  };

  const generateSpec = () => {
    const spec = normalizeToProjectSpec(wizardValues);
    setProjectSpec(spec);
    setGeneratedConfig(null);
  };

  const runGenerationPipeline = () => {
    if (!projectSpec) return;
    const config = generateWebsiteFromSpec(projectSpec);
    setGeneratedConfig(config);
  };

  return (
    <SpecContext.Provider
      value={{
        wizardValues,
        setWizardValues,
        projectSpec,
        generateSpec,
        generatedConfig,
        runGenerationPipeline,
      }}
    >
      {children}
    </SpecContext.Provider>
  );
}

export function useSpec() {
  const ctx = useContext(SpecContext);
  if (!ctx) {
    throw new Error("useSpec must be used within SpecProvider");
  }
  return ctx;
}
