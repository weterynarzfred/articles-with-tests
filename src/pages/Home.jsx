import { useState } from "react";
import { Link } from "react-router-dom";
import articles from "../data/articles";

const tagCounts = articles.flatMap(a => a.tags).reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {});
const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

function Home() {
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag
    ? articles.filter(a => a.tags.includes(activeTag))
    : articles;

  return <div className="content">
    <h1>you ever get bored and start writing articles?</h1>
    <p>A collection of short articles with exercises that help retention. While they are not in-depth, they are hopefully both informative and a reading comprehension exercise.</p>

    <div className="tag-filter">
      {allTags.map(tag => (
        <button
          key={tag}
          className={`tag-filter__tag${activeTag === tag ? " tag-filter__tag--active" : ""}`}
          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
        >
          {tag}
        </button>
      ))}
    </div>

    <div className="article-grid">
      {filtered.map(article => (
        <Link key={article.slug} to={`/articles/${article.slug}`}>
          <div className="link-cover">
            <img src={article.image} alt={article.imageAlt} />
            <div className="link-title">{article.title}</div>
          </div>
          <div className="link-meta">
            <div className="link-meta__tags">
              {article.tags.map(tag => <div key={tag} className="link-meta__tag">{tag}</div>)}
            </div>
            <div className="link-meta__blurb">{article.blurb}</div>
          </div>
        </Link>
      ))}
    </div>

  </div>;
}

export default Home;
