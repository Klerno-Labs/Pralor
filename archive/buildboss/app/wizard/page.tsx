"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSpec } from "../../lib/spec/SpecContext";
import { Card } from "../../components/Card";
import { StepIndicator } from "../../components/StepIndicator";

const TOTAL_STEPS = 4;

export default function WizardPage() {
  const { wizardValues, setWizardValues, generateSpec } = useSpec();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      generateSpec();
      router.push("/spec-preview");
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.push("/");
    } else {
      setStep((s) => s - 1);
    }
  };

  const update = (field: keyof typeof wizardValues, value: string) => {
    setWizardValues({ ...wizardValues, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <button
        onClick={handleBack}
        className="text-xs text-slate-400 hover:text-slate-200 mb-1"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-1">Website blueprint wizard</h1>
      <p className="text-sm text-slate-300 mb-2">
        Answer a few focused questions. BuildBoss will turn this into a structured spec
        and multi-agent generation plan.
      </p>

      <Card>
        <StepIndicator current={step} total={TOTAL_STEPS} />
        <form onSubmit={handleNext} className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Project basics</h2>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  What do you want this website to achieve? (goals, comma separated)
                </label>
                <textarea
                  rows={2}
                  value={wizardValues.goals}
                  onChange={(e) => update("goals", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Who is the primary audience?
                </label>
                <input
                  value={wizardValues.targetAudience}
                  onChange={(e) => update("targetAudience", e.target.value)}
                  placeholder="e.g. solo founders, small agencies, e-commerce brands"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Which pages do you want? (comma separated)
                </label>
                <input
                  value={wizardValues.pages}
                  onChange={(e) => update("pages", e.target.value)}
                />
                <p className="text-[11px] text-slate-400">
                  Example: Home, About, Features, Pricing, Contact
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Branding & visual style</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Brand / project name
                  </label>
                  <input
                    value={wizardValues.brandName}
                    onChange={(e) => update("brandName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Tagline
                  </label>
                  <input
                    value={wizardValues.brandTagline}
                    onChange={(e) => update("brandTagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Primary color (hex or word)
                  </label>
                  <input
                    value={wizardValues.primaryColor}
                    onChange={(e) => update("primaryColor", e.target.value)}
                    placeholder="#7c3aed or violet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Secondary color
                  </label>
                  <input
                    value={wizardValues.secondaryColor}
                    onChange={(e) => update("secondaryColor", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Accent color
                  </label>
                  <input
                    value={wizardValues.accentColor}
                    onChange={(e) => update("accentColor", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Typography & vibe
                </label>
                <input
                  value={wizardValues.typographyStyle}
                  onChange={(e) => update("typographyStyle", e.target.value)}
                  placeholder="e.g. modern, clean, techy, sans-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Imagery style
                </label>
                <input
                  value={wizardValues.imageryStyle}
                  onChange={(e) => update("imageryStyle", e.target.value)}
                  placeholder="e.g. minimal gradients, abstract shapes, product shots"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Structure, content & behavior</h2>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  How should the sections feel and flow?
                </label>
                <textarea
                  rows={3}
                  value={wizardValues.sectionsNotes}
                  onChange={(e) => update("sectionsNotes", e.target.value)}
                  placeholder="e.g. strong hero, 3-card feature row, proof/testimonials, pricing, FAQ, final CTA"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Any notes on copy, slogans, or messages?
                </label>
                <textarea
                  rows={3}
                  value={wizardValues.contentNotes}
                  onChange={(e) => update("contentNotes", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Forms needed (comma separated)
                  </label>
                  <input
                    value={wizardValues.forms}
                    onChange={(e) => update("forms", e.target.value)}
                    placeholder="contact, newsletter, waitlist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-300 mb-1">
                    Integrations (comma separated)
                  </label>
                  <input
                    value={wizardValues.integrations}
                    onChange={(e) => update("integrations", e.target.value)}
                    placeholder="email provider, analytics, live chat"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Behavior & polish</h2>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Animations & motion
                </label>
                <input
                  value={wizardValues.animations}
                  onChange={(e) => update("animations", e.target.value)}
                  placeholder="e.g. subtle fades and slides, nothing too flashy"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Accessibility notes
                </label>
                <textarea
                  rows={2}
                  value={wizardValues.accessibilityNotes}
                  onChange={(e) => update("accessibilityNotes", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-300 mb-1">
                  Any extra preferences or non-negotiables?
                </label>
                <textarea
                  rows={3}
                  value={wizardValues.extraPreferences}
                  onChange={(e) => update("extraPreferences", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              {step === 0 ? "Cancel" : "Back"}
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-slate-900 text-sm font-medium hover:opacity-90 transition"
            >
              {step === TOTAL_STEPS - 1 ? "Review spec" : "Next step"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
