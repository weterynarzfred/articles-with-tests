import { useState } from "react";
import { Link } from "react-router-dom";
import articles from "virtual:articles";

const tagCounts = articles.flatMap(a => a.tags).reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {});
const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

function ArticleGrid() {
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag
    ? articles.filter(a => a.tags.includes(activeTag))
    : articles;

  return <>
    <div className="tag-filter" role="group" aria-label="Filter by tag">
      {allTags.map(tag => (
        <button
          key={tag}
          className={`tag-filter__tag${activeTag === tag ? " tag-filter__tag--active" : ""}`}
          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          aria-pressed={activeTag === tag}
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
              {article.tags.map(tag => (
                <button
                  key={tag}
                  className={`link-meta__tag${activeTag === tag ? " link-meta__tag--active" : ""}`}
                  onClick={e => { e.stopPropagation(); e.preventDefault(); setActiveTag(activeTag === tag ? null : tag); }}
                  aria-pressed={activeTag === tag}
                >
                  {tag}
                </button>
              ))}
              {article.date && <span className="link-meta__date">{article.date}</span>}
            </div>
            <div className="link-meta__blurb">{article.blurb}</div>
          </div>
        </Link>
      ))}
    </div>
  </>;
}

export default ArticleGrid;
