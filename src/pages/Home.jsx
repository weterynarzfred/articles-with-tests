import { useEffect } from "react";
import ArticleGrid from "../Components/ArticleGrid";

function Home() {
  useEffect(() => { document.title = "rand articles"; }, []);

  return <div className="content">
    <h1>You ever got so bored you started writing articles?</h1>
    <p>A collection of short articles with exercises that help retention. I write them mostly to help myself learn about the world and organize that knowledge. Maybe someone will find them useful as well. While they are not in-depth in any particular topic, they are hopefully informative.</p>
    <ArticleGrid />
  </div>;
}

export default Home;
