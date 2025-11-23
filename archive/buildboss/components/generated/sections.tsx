import { ContentBlueprint, DesignSystem, LayoutTree, SectionType } from "../../lib/spec/types";

type SectionsRendererProps = {
  design: DesignSystem;
  layout: LayoutTree;
  content: ContentBlueprint;
};

export function GeneratedSitePreview({ design, layout, content }: SectionsRendererProps) {
  const page = layout.pages.find((p) => p.route === "/") || layout.pages[0];
  const pageContent = content.pages.find((p) => p.id === page.id);

  if (!page || !pageContent) {
    return <div className="text-sm text-slate-400">No preview available yet.</div>;
  }

  return (
    <div className="space-y-12">
      {page.sections.map((section) => {
        const sectionContent = pageContent.sections.find((s) => s.id === section.id);
        if (!sectionContent) return null;
        return (
          <SectionWrapper key={section.id} type={section.type} design={design}>
            <SectionContent type={section.type} content={sectionContent} design={design} />
          </SectionWrapper>
        );
      })}
    </div>
  );
}

function SectionWrapper({
  children,
  type,
  design,
}: {
  children: React.ReactNode;
  type: SectionType;
  design: DesignSystem;
}) {
  const padding = "py-12 md:py-16";
  const border =
    type === "hero" ? "border border-slate-700/70" : "border border-slate-800/60";
  return (
    <section
      className={`${padding} ${design.layout.borderRadius} ${border} bg-gradient-to-b from-slate-950/80 to-slate-900/40 px-6 md:px-10`}
    >
      {children}
    </section>
  );
}

function SectionContent({
  type,
  content,
  design,
}: {
  type: SectionType;
  content: {
    headline: string;
    body: string;
    cta?: string;
  };
  design: DesignSystem;
}) {
  switch (type) {
    case "hero":
      return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {content.headline}
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              {content.body}
            </p>
            {content.cta && (
              <div className="pt-2">
                <button className={design.components.buttonStyle}>{content.cta}</button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="h-40 md:h-48 rounded-2xl bg-gradient-to-tr from-accent/20 via-slate-500/10 to-accent/40 border border-accent/40 shadow-2xl shadow-accent/30" />
          </div>
        </div>
      );
    case "features":
      return (
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">{content.headline}</h2>
          <p className="text-sm text-slate-300 max-w-2xl">{content.body}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Fast to launch", "Designed to convert", "Easy to extend"].map((label) => (
              <div
                key={label}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/80 px-4 py-4 text-sm"
              >
                <div className="font-medium mb-1">{label}</div>
                <div className="text-slate-400 text-xs">
                  Tight copy explaining why this matters in one short sentence.
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{content.headline}</h2>
            <p className="text-sm text-slate-300 max-w-lg">{content.body}</p>
          </div>
          {content.cta && (
            <button className={design.components.buttonStyle}>{content.cta}</button>
          )}
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <h2 className="text-lg md:text-xl font-semibold">{content.headline}</h2>
          <p className="text-sm text-slate-300 max-w-2xl">{content.body}</p>
        </div>
      );
  }
}
