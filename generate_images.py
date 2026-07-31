"""
Generates elegant, abstract, on-brand placeholder imagery for Nikoo Aesthetics.

Rather than using stock photography (which would misrepresent a real clinic),
each image is a soft gradient in the brand palette (ink / warm white /
champagne gold) with a single flowing line-art mark unique to its slug —
an editorial, printmaking-inspired treatment that suits a luxury medical
aesthetics brand and needs no attribution or licensing.

Run: python3 generate_images.py
"""

import hashlib
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

INK = (0, 0, 0)
WARM = (255, 255, 255)
GOLD = (64, 64, 64)
GOLD_LIGHT = (140, 140, 140)

OUT = "public/images"
SUPERSAMPLE = 2


def seeded_random(key: str) -> random.Random:
    h = hashlib.sha256(key.encode()).hexdigest()
    return random.Random(int(h[:12], 16))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vertical_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size, top)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        color = lerp(top, bottom, t)
        for x in range(0, w, 4):  # step for speed, then fill blocks
            px[x, y] = color
    # fill remaining columns quickly using row copy
    row = Image.new("RGB", (w, 1))
    for y in range(h):
        t = y / max(h - 1, 1)
        color = lerp(top, bottom, t)
        row.paste(Image.new("RGB", (w, 1), color), (0, 0))
        img.paste(row, (0, y))
    return img


def add_grain(img, rng, amount=6):
    w, h = img.size
    noise = Image.effect_noise((w, h), amount).convert("L")
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img, noise_rgb, 0.035)


def flowing_line(draw, w, h, rng, color, width, points=6, margin=0.12):
    """A single smooth flowing stroke reminiscent of a contour line."""
    xs = []
    ys = []
    for i in range(points):
        t = i / (points - 1)
        x = w * (margin + (1 - 2 * margin) * t)
        y = h * (0.2 + 0.6 * rng.random())
        xs.append(x)
        ys.append(y)

    steps = 200
    prev = None
    for s in range(steps + 1):
        t = s / steps
        # Catmull-Rom-ish smoothing via simple weighted average of neighbours
        idx = t * (points - 1)
        i0 = int(idx)
        i1 = min(i0 + 1, points - 1)
        local_t = idx - i0
        x = xs[i0] + (xs[i1] - xs[i0]) * local_t
        y = ys[i0] + (ys[i1] - ys[i0]) * local_t
        if prev:
            draw.line([prev, (x, y)], fill=color, width=width)
        prev = (x, y)


def concentric_arcs(draw, w, h, rng, color, count=3):
    cx = w * (0.65 + rng.random() * 0.2)
    cy = h * (0.25 + rng.random() * 0.5)
    base_r = min(w, h) * (0.18 + rng.random() * 0.08)
    start = rng.uniform(0, 360)
    for i in range(count):
        r = base_r + i * min(w, h) * 0.07
        sweep = rng.uniform(70, 170)
        a0 = start + i * rng.uniform(-20, 20)
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.arc(bbox, a0, a0 + sweep, fill=color, width=2)


def make_image(path, w, h, key, dark=False, monogram=False):
    rng = seeded_random(key)
    ss = SUPERSAMPLE
    W, H = w * ss, h * ss

    if dark:
        top, bottom = INK, (22, 22, 22)
        line_color = GOLD
        accent_alpha_color = (199, 169, 107)
    else:
        top, bottom = WARM, lerp(WARM, GOLD_LIGHT, 0.35)
        line_color = (60, 60, 60)
        accent_alpha_color = INK

    base = vertical_gradient((W, H), top, bottom)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Signature flowing line motif, unique per slug
    flowing_line(draw, W, H, rng, line_color + (235,), width=max(2, W // 260))
    concentric_arcs(draw, W, H, rng, line_color + (110,), count=rng.randint(2, 4))

    # Fine hairline frame inset, quiet luxury detail
    inset = int(W * 0.045)
    draw.rectangle(
        [inset, inset, W - inset, H - inset],
        outline=line_color + (90,),
        width=max(1, W // 700),
    )

    if monogram:
        # Small centred serif-like "N" mark using simple strokes (font-free)
        cx, cy = W * 0.5, H * 0.5
        s = min(W, H) * 0.09
        pts = [
            (cx - s, cy + s),
            (cx - s, cy - s),
            (cx + s, cy + s),
            (cx + s, cy - s),
        ]
        draw.line([pts[0], pts[1]], fill=line_color + (255,), width=max(2, W // 220))
        draw.line([pts[1], pts[2]], fill=line_color + (255,), width=max(2, W // 220))
        draw.line([pts[2], pts[3]], fill=line_color + (255,), width=max(2, W // 220))

    combined = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
    combined = combined.filter(ImageFilter.GaussianBlur(radius=ss * 0.4))
    combined = add_grain(combined, rng, amount=8)

    # Soft vignette
    vignette = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse([-W * 0.2, -H * 0.2, W * 1.2, H * 1.2], fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(W * 0.08))
    dark_layer = Image.new("RGB", (W, H), (0, 0, 0) if not dark else (0, 0, 0))
    combined = Image.composite(combined, dark_layer, vignette.point(lambda p: int(p * 0.92 + 8)))

    final = combined.resize((w, h), Image.LANCZOS)
    final.save(path, quality=95, optimize=True)
    print(f"  wrote {path}")


def main():
    os.makedirs(f"{OUT}/hero", exist_ok=True)
    os.makedirs(f"{OUT}/treatments", exist_ok=True)
    os.makedirs(f"{OUT}/gallery", exist_ok=True)
    os.makedirs(f"{OUT}/team", exist_ok=True)
    os.makedirs(f"{OUT}/logo", exist_ok=True)

    print("Hero + brand imagery")
    make_image(f"{OUT}/hero/hero.jpg", 2880, 1800, "hero", dark=False)
    make_image(f"{OUT}/team/nikoo-portrait.jpg", 1800, 2250, "about", dark=False, monogram=True)
    make_image(f"{OUT}/og-cover.jpg", 1200, 630, "og-cover", dark=False)

    treatments = [
        "anti-wrinkle-injections", "dermal-fillers", "lip-fillers",
        "cheek-fillers", "jawline-filler", "chin-filler",
        "skin-boosters", "profhilo", "microneedling", "chemical-peel",
    ]
    print("Treatment imagery")
    for i, slug in enumerate(treatments):
        make_image(f"{OUT}/treatments/{slug}.jpg", 1600, 2000, slug, dark=(i % 3 == 0))

    gallery = [
        ("g1", "lips-01"), ("g2", "cheeks-01"), ("g3", "skin-01"),
        ("g4", "jawline-01"), ("g5", "anti-wrinkle-01"), ("g6", "skin-02"),
        ("g7", "lips-02"), ("g8", "cheeks-02"), ("g9", "jawline-02"),
    ]
    print("Gallery imagery")
    for i, (gid, key) in enumerate(gallery):
        make_image(f"{OUT}/gallery/{gid}.jpg", 1600, 2000, key, dark=(i % 4 == 0))

    print("Done.")


if __name__ == "__main__":
    main()
