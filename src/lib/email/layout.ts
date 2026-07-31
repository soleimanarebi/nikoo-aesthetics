import { getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

/**
 * Shared branded wrapper for every transactional email Nikoo Aesthetics
 * sends. Table-based, inline-styled HTML for maximum compatibility across
 * email clients (including Outlook, which ignores most modern CSS).
 *
 * Every new email type (booking, contact, and future reminder/cancellation/
 * approval emails) should be built by passing its content into
 * `emailLayout()` rather than writing a new wrapper from scratch — this is
 * the single source of truth for the look of every clinic email.
 */

const INK = "#111111";
const CREAM = "#FAF7F2";
const WARM_WHITE = "#FFFFFF";
const GOLD = "#B08D57";
const MUTED = "#6B6660";
const BORDER = "#E8E1D6";

export interface EmailLayoutOptions {
  /** Short line shown in inbox previews (not visible in the email body). */
  previewText: string;
  /** Large heading shown at the top of the email body. */
  heading: string;
  /** Pre-built inner HTML (tables/paragraphs) — see the `row`/`table` helpers below. */
  bodyHtml: string;
}

export function emailLayout({ previewText, heading, bodyHtml }: EmailLayoutOptions): string {
  const site = getSiteSettings();
  const logoUrl = `${SITE_URL}/images/logo/nikoo-logo.png`;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(site.name)}</title>
    <!--[if mso]>
    <style>table {border-collapse: collapse;}</style>
    <![endif]-->
  </head>
  <body style="margin:0; padding:0; background-color:${CREAM}; font-family: Georgia, 'Times New Roman', serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
      ${escapeHtml(previewText)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%; max-width:600px; background-color:${WARM_WHITE}; border:1px solid ${BORDER}; border-radius:12px; overflow:hidden;">

            <!-- Header / Logo -->
            <tr>
              <td align="center" style="padding: 40px 32px 24px; border-bottom: 1px solid ${BORDER};">
                <img
                  src="${logoUrl}"
                  alt="${escapeHtml(site.name)}"
                  width="120"
                  style="display:block; width:120px; height:auto; margin:0 auto;"
                />
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td align="center" style="padding: 32px 32px 8px;">
                <h1 style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-weight:400; font-size:24px; line-height:1.3; color:${INK};">
                  ${escapeHtml(heading)}
                </h1>
                <div style="width:48px; height:1px; background-color:${GOLD}; margin: 20px auto 0;"></div>
              </td>
            </tr>

            <!-- Body content -->
            <tr>
              <td style="padding: 24px 32px 8px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:15px; line-height:1.6; color:${INK};">
                ${bodyHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; margin-top: 16px;">
                <div style="border-top: 1px solid ${BORDER}; padding-top: 24px; text-align:center; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:12px; line-height:1.8; color:${MUTED};">
                  <p style="margin:0 0 6px; font-family: Georgia, serif; font-size:14px; color:${INK};">${escapeHtml(site.name)}</p>
                  <p style="margin:0 0 4px;">${escapeHtml(site.address.area)}, ${escapeHtml(site.address.region)}, ${escapeHtml(site.address.country)}</p>
                  <p style="margin:0 0 4px;">
                    <a href="tel:${escapeHtml(site.phone.replace(/\s/g, ""))}" style="color:${MUTED}; text-decoration:none;">${escapeHtml(site.phone)}</a>
                    &nbsp;·&nbsp;
                    <a href="mailto:${escapeHtml(site.email)}" style="color:${MUTED}; text-decoration:none;">${escapeHtml(site.email)}</a>
                  </p>
                  <p style="margin: 12px 0 0; color:#A39D93;">© ${year} ${escapeHtml(site.name)}. All rights reserved.</p>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** A single label/value row used inside email body tables (e.g. booking details). */
export function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding: 10px 0; border-bottom: 1px solid ${BORDER}; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:${MUTED}; width:38%; vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="padding: 10px 0; border-bottom: 1px solid ${BORDER}; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; color:${INK}; vertical-align:top;">
      ${escapeHtml(value)}
    </td>
  </tr>`;
}

/** Wraps a set of detailRow()s in a full-width table. */
export function detailsTable(rowsHtml: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0 8px;">${rowsHtml}</table>`;
}

/** A simple paragraph with consistent body styling. */
export function paragraph(text: string): string {
  return `<p style="margin: 0 0 16px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:15px; line-height:1.6; color:${INK};">${escapeHtml(text)}</p>`;
}

/** A gold call-to-action button/link. */
export function ctaButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
    <tr>
      <td align="center" style="border-radius:999px; background-color:${INK};">
        <a href="${href}" style="display:inline-block; padding:14px 32px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:0.02em; color:${WARM_WHITE}; text-decoration:none; border-radius:999px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Escapes user-submitted text before it's interpolated into HTML — required since form data is untrusted input. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
