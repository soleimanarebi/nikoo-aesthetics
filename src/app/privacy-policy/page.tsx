import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Nikoo Aesthetics",
  description: "How Nikoo Aesthetics collects, uses and protects your personal data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const site = getSiteSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <div className="prose-none max-w-2xl flex flex-col gap-8 font-body text-ink/75 leading-relaxed text-sm">
          <p>
            {site.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your
            privacy. This policy explains what personal data we collect, how
            we use it, and the choices you have.
          </p>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name,
              contact details and medical history shared during consultation,
              as well as information submitted through our contact form and
              booking platform.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">How We Use Your Data</h2>
            <p>
              Your data is used to provide safe, personalised treatment, manage
              appointments, and respond to enquiries. Medical information is
              held securely and only accessed by your treating practitioner.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Your Rights</h2>
            <p>
              You have the right to access, correct or request deletion of
              your personal data at any time. Contact us at {site.email} for
              any privacy-related request.
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
