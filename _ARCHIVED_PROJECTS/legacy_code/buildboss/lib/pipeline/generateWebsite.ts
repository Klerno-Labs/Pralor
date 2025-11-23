import {
  GeneratedWebsiteConfig,
  ProjectSpec,
} from "../spec/types";
import { createTasksFromSpec } from "../agents/bossAgent";
import { runDesignAgent } from "../agents/designAgent";
import { runStructureAgent } from "../agents/structureAgent";
import { runContentAgent } from "../agents/contentAgent";
import { runCodeAgent } from "../agents/codeAgent";
import { runAuditAgent } from "../agents/auditAgent";

export function generateWebsiteFromSpec(spec: ProjectSpec): GeneratedWebsiteConfig {
  const tasks = createTasksFromSpec(spec);
  const designTask = tasks.find((t) => t.type === "design")!;
  const structureTask = tasks.find((t) => t.type === "structure")!;
  const contentTask = tasks.find((t) => t.type === "content")!;
  const codeTask = tasks.find((t) => t.type === "code")!;
  const auditTask = tasks.find((t) => t.type === "audit")!;

  const designSystem = runDesignAgent(spec, designTask);
  const layoutTree = runStructureAgent(spec, structureTask);
  const contentBlueprint = runContentAgent(spec, contentTask);
  const implementationPlan = runCodeAgent(
    spec,
    codeTask,
    layoutTree,
    designSystem,
    contentBlueprint,
  );

  const baseConfig: GeneratedWebsiteConfig = {
    spec,
    designSystem,
    layoutTree,
    contentBlueprint,
    implementationPlan,
    auditFindings: [],
  };

  const auditFindings = runAuditAgent(baseConfig, auditTask);

  return {
    ...baseConfig,
    auditFindings,
  };
}
