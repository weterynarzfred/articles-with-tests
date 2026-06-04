const BASE = window.location.origin + import.meta.env.BASE_URL;

function setMeta(selector, content) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute("content", content ?? "");
}

export function setPageMeta({ title, description, image, type = "website", date }) {
  const imageUrl = image ? BASE + image : null;

  document.title = title;
  setMeta(`meta[name="description"]`, description);

  setMeta(`meta[property="og:title"]`, title);
  setMeta(`meta[property="og:description"]`, description);
  setMeta(`meta[property="og:url"]`, window.location.href);
  setMeta(`meta[property="og:type"]`, type);
  if (imageUrl) setMeta(`meta[property="og:image"]`, imageUrl);

  setMeta(`meta[name="twitter:title"]`, title);
  setMeta(`meta[name="twitter:description"]`, description);
  if (imageUrl) setMeta(`meta[name="twitter:image"]`, imageUrl);

  setMeta(`meta[property="article:published_time"]`, date ?? "");
}
