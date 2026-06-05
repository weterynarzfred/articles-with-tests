import { useState } from "react";
import { Link } from "react-router-dom";
import articles from "virtual:articles";
import { useResponsiveImage } from "../utils/useResponsiveImage";

const tagCounts = articles.flatMap(a => a.tags).reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {});
const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

function ArticleCard({ article, activeTag, onTagClick }) {
  const { containerRef, imgRef } = useResponsiveImage(article.image);

  return (
    <Link to={`/articles/${article.slug}`}>
      <div className="link-cover" ref={containerRef}>
        <img ref={imgRef} alt={article.imageAlt} />
        <div className="link-title">{article.title}</div>
      </div>
      <div className="link-meta">
        <div className="link-meta__tags">
          {article.tags.map(tag => (
            <button
              key={tag}
              className={`link-meta__tag${activeTag === tag ? " link-meta__tag--active" : ""}`}
              onClick={e => { e.stopPropagation(); e.preventDefault(); onTagClick(tag); }}
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
  );
}

function ArticleGrid() {
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag
    ? articles.filter(a => a.tags.includes(activeTag))
    : articles;

  const handleTagClick = tag => setActiveTag(prev => prev === tag ? null : tag);

  return <>
    <div className="tag-filter" role="group" aria-label="Filter by tag">
      {allTags.map(tag => (
        <button
          key={tag}
          className={`tag-filter__tag${activeTag === tag ? " tag-filter__tag--active" : ""}`}
          onClick={() => handleTagClick(tag)}
          aria-pressed={activeTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>

    <div className="article-grid">
      {filtered.map(article => (
        <ArticleCard
          key={article.slug}
          article={article}
          activeTag={activeTag}
          onTagClick={handleTagClick}
        />
      ))}
    </div>
  </>;
}

export default ArticleGrid;
