import {
  AuditFinding,
  GeneratedWebsiteConfig,
  TaskSpec,
} from "../spec/types";

export function runAuditAgent(
  config: GeneratedWebsiteConfig,
  _task: TaskSpec,
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (!config.spec.behavior.accessibilityNotes) {
    findings.push({
      id: "accessibility-notes",
      severity: "suggestion",
      message:
        "Consider documenting specific accessibility requirements (contrast levels, focus states, keyboard navigation).",
    });
  }

  const hasHeroOnHome = config.layoutTree.pages.some(
    (p) => p.route === "/" && p.sections.some((s) => s.type === "hero"),
  );
  if (!hasHeroOnHome) {
    findings.push({
      id: "home-hero",
      severity: "warning",
      message:
        "Homepage is missing a hero section. Add a strong, above-the-fold hero for clarity and conversions.",
    });
  }

  const pagesWithoutCta = config.layoutTree.pages
    .filter((p) => !p.sections.some((s) => s.type === "cta"))
    .map((p) => p.name);
  if (pagesWithoutCta.length) {
    findings.push({
      id: "pages-without-cta",
      severity: "suggestion",
      message: `Consider adding a clear CTA section on: ${pagesWithoutCta.join(
        ", ",
      )}.`,
    });
  }

  return findings;
}
