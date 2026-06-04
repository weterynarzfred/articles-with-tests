import { useEffect } from "react";
import ArticleGrid from "../Components/ArticleGrid";
import { setPageMeta } from "../utils/pageMeta";

const DESCRIPTION = "A collection of short articles with exercises that help retention. I write them mostly to help myself learn about the world and organize that knowledge.";

function Home() {
  useEffect(() => {
    setPageMeta({
      title: "You ever got so bored you started writing articles?",
      description: DESCRIPTION,
      image: "media/ogimg.jpg",
      type: "website",
    });
  }, []);

  return <main className="content" tabIndex="-1">
    <h1>You ever got so bored you started writing articles?</h1>
    <p>{DESCRIPTION} Maybe someone will find them useful as well. While they are not in-depth in any particular topic, they are hopefully informative.</p>
    <ArticleGrid />
  </main>;
}

export default Home;
