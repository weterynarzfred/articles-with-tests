import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";

import DragAndDrop from "../components/DragAndDrop";
import DropZone from "../components/DropZone";
import Choices from "../components/Choices";
import Choice from "../components/Choice";
import ChoiceSet from "../components/ChoiceSet";
import Img from "../components/Img";
import Categorize from "../components/Categorize";
import Category from "../components/Category";
import FillIn from "../components/FillIn";
import Blank from "../components/Blank";

import articleList from "virtual:articles";

const articles = import.meta.glob("../../articles/**/*.mdx");

export default function Article() {
  const { "*": slug } = useParams();
  const safeSlug = slug?.toLowerCase().match(/^[a-z0-9-_\/]+$/)?.[0];

  const [Component, setComponent] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!safeSlug) {
      setComponent(() => () => <h1>Invalid article</h1>);
      return;
    }

    const currentSlug = safeSlug;

    const loader = articles[`../../articles/${currentSlug}.mdx`];
    if (!loader) {
      setComponent(() => () => <h1>Article not found</h1>);
      return;
    }

    window.scrollTo(0, 0);
    const meta = articleList.find(a => a.slug === currentSlug);
    document.title = meta?.title ?? currentSlug;
    setMeta(meta ?? null);

    loader()
      .then(mod => {
        if (currentSlug === safeSlug) setComponent(() => mod.default);
      })
      .catch(() => {
        setComponent(() => () => <>
          <h1>Error</h1>
          <p>Failed to load article</p>
        </>);
      });
  }, [safeSlug]);

  if (!Component) return <div id="Article">Loading…</div>;

  return <div id="Article">
    <main className="content" tabIndex="-1">
      <MDXProvider
        components={{
          h1: ({ children }) => <>
            <h1>{children}</h1>
            {(meta?.date || meta?.tags?.length > 0) && (
              <div className="article-meta">
                {meta?.date && <span className="article-meta__date">{meta.date}</span>}
                {meta?.tags?.map(tag => <span key={tag} className="article-meta__tag">{tag}</span>)}
              </div>
            )}
          </>,
          hr: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308.27 11.47" className="separator">
            <polygon points="0.33,5.74 3.03,3.03 5.74,5.74 3.03,8.44" />
            <polygon points="302.53,5.74 305.24,3.03 307.94,5.74 305.24,8.44" />
            <polygon points="148.73,5.74 154.13,0.33 159.54,5.74 154.13,11.14" />
            <line x1="166.82" y1="5.74" x2="297.55" y2="5.74" />
            <line x1="10.71" y1="5.74" x2="141.45" y2="5.74" />
          </svg>,
          Link,
          DragAndDrop,
          DropZone,
          Choices,
          Choice,
          ChoiceSet,
          Img,
          Categorize,
          Category,
          FillIn,
          Blank,
        }}
      >
        <Component />
      </MDXProvider>
    </main>
  </div>;
}
