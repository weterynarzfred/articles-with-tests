import { useEffect, useRef } from "react";
import imageSizes from "virtual:image-sizes";

const WIDTHS = [256, 384, 512, 768, 1024, 1536, 2048];
const BASE = import.meta.env.BASE_URL;

function normalizeSrc(src) {
  if (!src || src.startsWith("http")) return null;
  if (src.startsWith("./")) return "articles/" + src.slice(2);
  if (!src.includes("/")) return "articles/" + src;
  return src;
}

function buildSrcset(normalizedPath) {
  const origWidth = imageSizes[normalizedPath];
  if (!origWidth) return null;

  const dot = normalizedPath.lastIndexOf(".");
  const noExt = dot >= 0 ? normalizedPath.slice(0, dot) : normalizedPath;
  const available = WIDTHS.filter(w => w <= origWidth);
  if (!available.length) return null;

  return available.map(w => `${BASE}${noExt}-${w}.webp ${w}w`).join(", ");
}

export function useResponsiveImage(src, eager = false) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src || !imgRef.current) return;

    const normalized = normalizeSrc(src);
    if (!normalized) {
      imgRef.current.src = src;
      return;
    }

    const srcset = buildSrcset(normalized);
    if (!srcset) {
      imgRef.current.src = BASE + normalized;
      return;
    }

    const activate = width => {
      imgRef.current.sizes = `${Math.ceil(width)}px`;
      imgRef.current.srcset = srcset;
    };

    if (eager) {
      activate(containerRef.current?.getBoundingClientRect().width ?? 1024);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        activate(entry.target.getBoundingClientRect().width);
        observer.disconnect();
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src, eager]);

  return { containerRef, imgRef };
}
