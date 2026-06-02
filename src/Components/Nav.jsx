import { Link } from "react-router-dom";
import { useState } from "react";

function getInitialDark() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Nav() {
  const [dark, setDark] = useState(getInitialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav>
      <div><Link to="/">home</Link></div>
      <div><Link to="https://weterynarzfred.github.io/articles-with-tests/" target="_blank" rel="noopener noreferrer">source code</Link></div>
      <button
        className="button"
        onClick={toggle}
        aria-label="Toggle theme"
        style={{ marginLeft: "auto" }}
      >
        {dark ? "☀" : "☾"}
      </button>
    </nav>
  );
}
