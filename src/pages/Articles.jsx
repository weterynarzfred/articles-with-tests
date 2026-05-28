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

const articles = import.meta.glob("../../articles/**/*.mdx");

export default function Article() {
  const { "*": slug } = useParams();
  const safeSlug = slug?.toLowerCase().match(/^[a-z0-9-_\/]+$/)?.[0];

  const [Component, setComponent] = useState(null);

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

    loader()
      .then(mod => {
        if (currentSlug === safeSlug) setComponent(() => mod.default);
      })
      .catch(() => {
        setComponent(() => () => (
          <>
            <h1>Error</h1>
            <p>Failed to load article</p>
          </>
        ));
      });
  }, [safeSlug]);

  if (!Component) return <div id="Article">Loading…</div>;

  return <div id="Article">
    <div className="content">
      <MDXProvider
        components={{
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
    </div>
  </div>;
}
