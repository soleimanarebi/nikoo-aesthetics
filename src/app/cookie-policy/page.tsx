import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy | Nikoo Aesthetics",
  description: "How Nikoo Aesthetics uses cookies on this website.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" />
      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl flex flex-col gap-8 font-body text-ink/75 leading-relaxed text-sm">
          <div>
            <h2 className="font-display text-xl text-ink mb-2">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device that help
              websites function correctly and understand how they&apos;re used.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Cookies We Use</h2>
            <p>
              This site uses essential cookies required for core
              functionality, and may use analytics cookies to help us
              understand site usage and improve the experience. No cookies
              are used to collect medical or treatment information.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Managing Cookies</h2>
            <p>
              Most browsers allow you to control cookies through their
              settings. Disabling certain cookies may affect site
              functionality.
            </p>
          </div>
          <p className="text-ink/65 text-xs">
            This is placeholder policy text. Replace with policy drafted or
            reviewed by a qualified professional before launch.
          </p>
        </div>
      </section>
    </>
  );
}
