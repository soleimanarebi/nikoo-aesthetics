"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            className="block w-full relative rounded-xl2 overflow-hidden shadow-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={`View larger image: ${img.caption}`}
          >
            <Image
              src={img.image}
              alt={img.caption}
              width={1000}
              height={750}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-warm text-sm font-body">{img.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-warm text-3xl leading-none font-display"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div className="relative max-w-3xl w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.image}
              alt={lightbox.caption}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
