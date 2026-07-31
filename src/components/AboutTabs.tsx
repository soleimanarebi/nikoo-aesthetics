"use client";

import { useState } from "react";
import type { AftercareDocument } from "@/lib/types";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AboutTabs({
  story,
  documents,
}: {
  story: React.ReactNode;
  documents: AftercareDocument[];
}) {
  const [tab, setTab] = useState<"story" | "aftercare">("story");

  return (
    <div>
      <div className="flex gap-8 border-b border-ink/10 mb-12" role="tablist" aria-label="About Nikoo Aesthetics">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "story"}
          onClick={() => setTab("story")}
          className={`pb-4 font-body text-sm tracking-wide border-b-2 -mb-px transition-colors ${
            tab === "story" ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Our Story
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "aftercare"}
          onClick={() => setTab("aftercare")}
          className={`pb-4 font-body text-sm tracking-wide border-b-2 -mb-px transition-colors ${
            tab === "aftercare" ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Aftercare Documents
        </button>
      </div>

      {tab === "story" ? (
        <div role="tabpanel">{story}</div>
      ) : (
        <div role="tabpanel">
          <p className="text-ink/65 font-body text-sm leading-relaxed mb-8 max-w-xl">
            Download aftercare guidance for your treatment. Following these instructions
            closely helps support a smooth recovery and the best possible results.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
            {documents.map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                download
                className="flex items-center justify-between gap-4 rounded-xl2 border border-ink/15 px-5 py-4 hover:border-ink transition-colors"
              >
                <span className="font-body text-sm text-ink">{doc.title}</span>
                <span className="flex items-center gap-1.5 text-ink/50 text-xs shrink-0">
                  <DownloadIcon />
                  PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
