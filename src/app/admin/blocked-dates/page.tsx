import type { Metadata } from "next";
import { cookies } from "next/headers";
import PageHero from "@/components/PageHero";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import BlockedDatesManager from "@/components/admin/BlockedDatesManager";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

// Never indexed, never linked from the site's navigation — reached only
// by whoever knows the URL, and protected by the password gate below.
export const metadata: Metadata = {
  title: "Admin | Nikoo Aesthetics",
  robots: { index: false, follow: false },
};

// Always check the cookie fresh on every request — this page must never
// be statically cached, or one visitor could see another's admin state.
export const dynamic = "force-dynamic";

export default async function AdminBlockedDatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = verifySessionToken(token);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Manage Blocked Dates"
        description="Temporarily close specific dates without changing your normal opening hours."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        {isAuthenticated ? <BlockedDatesManager /> : <AdminLoginForm />}
      </section>
    </>
  );
}
