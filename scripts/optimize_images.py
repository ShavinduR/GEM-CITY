#!/usr/bin/env python3
"""Generate responsive WebP derivatives for the website.

Usage:
    python3 scripts/optimize_images.py            # process everything in MANIFEST
    python3 scripts/optimize_images.py SRC NAME   # one image -> images/opt/NAME-<w>.webp

Each source image is resized (never upscaled) to the widths listed and saved
as WebP into images/opt/. Reference them in HTML with srcset, e.g.
    images/opt/hero-960.webp 960w, images/opt/hero-1600.webp 1600w
Requires Pillow:  pip install pillow
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "opt"
PRODUCT = (480, 960)  # product cards + product dialog

# (source, output name, widths)
MANIFEST = [
    ("images/ui/jewelleryw/01.webp", "hero-set", (640, 1080, 1440)),
    ("images/ui/hero2.webp", "source-river", (900,)),
    ("images/ui/jewelleryw/jewelery crafting.webp", "crafting", (800, 1280)),
    ("images/ui/me.png", "founder", (400, 720)),
    ("images/gemw/gem1.webp", "cat-gems", (640, 960)),
    ("images/ui/jewelleryw/servetphotograph-ring-5475926_1920.webp", "cat-bespoke", (640, 960)),
    ("images/ui/jewelleryw/03.webp", "cat-jewellery", (640, 960)),
    ("images/blog/gem certificate.jpg", "certificate", (480, 960)),
    ("images/blog/polish.jpg", "polish", (640, 1200)),
    ("images/gemw/gem3.webp", "gem-peach", (640, 960)),
    ("images/ui/jewelleryw/earring1.webp", "j-earring1", PRODUCT),
    ("images/ui/jewelleryw/necklace1.webp", "j-necklace1", PRODUCT),
    ("images/ui/jewelleryw/ring1.webp", "j-ring1", PRODUCT),
    ("images/ui/jewelleryw/jewel-bg.webp", "j-nawarathna", PRODUCT),
    ("images/ui/jewelleryw/p.webp", "j-pendant-p", PRODUCT),
] + [(f"images/ui/jewelleryw/{i:02d}.webp", f"j-{i:02d}", PRODUCT) for i in range(1, 24)]


def optimize(src: str, name: str, widths) -> None:
    path = ROOT / src
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        for w in widths:
            target = OUT / f"{name}-{w}.webp"
            copy = im.copy()
            if copy.width > w:
                copy = copy.resize((w, round(copy.height * w / copy.width)), Image.LANCZOS)
            copy.save(target, "WEBP", quality=78, method=6)
            print(f"{target.relative_to(ROOT)}  {copy.width}x{copy.height}  {target.stat().st_size // 1024} KB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if len(sys.argv) == 3:
        optimize(sys.argv[1], sys.argv[2], PRODUCT)
        return
    for src, name, widths in MANIFEST:
        optimize(src, name, widths)


if __name__ == "__main__":
    main()
