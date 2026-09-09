"""Build mobile-optimized wedding gallery image variants."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


THUMB_SIZE = 224
DISPLAY_LONG_EDGE = 1536
FULL_LONG_EDGE = 2400


def numeric_jpegs(folder: Path) -> list[Path]:
    files = [path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}]
    try:
        files.sort(key=lambda path: int(path.stem))
    except ValueError as exc:
        raise ValueError("Gallery source filenames must be numeric, such as 1.jpg.") from exc

    expected = list(range(1, len(files) + 1))
    actual = [int(path.stem) for path in files]
    if actual != expected:
        raise ValueError(f"Gallery source numbers must be continuous. Expected {expected}, got {actual}.")
    return files


def resize_long_edge(image: Image.Image, target: int) -> Image.Image:
    width, height = image.size
    longest = max(width, height)
    if longest <= target:
        return image.copy()
    scale = target / longest
    size = (max(1, round(width * scale)), max(1, round(height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def save_jpeg(image: Image.Image, path: Path, quality: int) -> None:
    image.save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)


def build_gallery(source: Path, output: Path) -> None:
    files = numeric_jpegs(source)
    if not files:
        raise ValueError("No JPG source images were found.")
    if output.exists() and any(output.iterdir()):
        raise ValueError(f"Output directory must be empty: {output}")

    thumb_dir = output / "thumb"
    display_dir = output / "display"
    full_dir = output / "full"
    for folder in (thumb_dir, display_dir, full_dir):
        folder.mkdir(parents=True, exist_ok=True)

    for index, source_path in enumerate(files, start=1):
        with Image.open(source_path) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            thumb = ImageOps.fit(
                image,
                (THUMB_SIZE, THUMB_SIZE),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            display = resize_long_edge(image, DISPLAY_LONG_EDGE)
            full = resize_long_edge(image, FULL_LONG_EDGE)

            filename = f"{index}.jpg"
            save_jpeg(thumb, thumb_dir / filename, quality=74)
            save_jpeg(display, display_dir / filename, quality=84)
            save_jpeg(full, full_dir / filename, quality=88)

            print(
                f"{filename}: source={image.width}x{image.height}, "
                f"thumb={thumb.width}x{thumb.height}, "
                f"display={display.width}x{display.height}, "
                f"full={full.width}x{full.height}"
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    build_gallery(args.source.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
