import { readFileSync, readdirSync } from "fs";
import { resolve, basename } from "path";
import matter from "gray-matter";

const VIRTUAL_ID = "virtual:articles";
const RESOLVED_ID = "\0virtual:articles";

function buildModule() {
  const dir = resolve("articles");
  const articles = readdirSync(dir)
    .filter(f => f.endsWith(".mdx"))
    .map(file => {
      const { data } = matter(readFileSync(resolve(dir, file), "utf-8"));
      const slug = basename(file, ".mdx");
      const date = data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : data.date;
      return { ...data, slug, date };
    })
    .filter(a => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return `export default ${JSON.stringify(articles)};`;
}

export default function articlesPlugin() {
  return {
    name: "vite-plugin-articles",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id === RESOLVED_ID) return buildModule();
    },

    configureServer(server) {
      const onChange = file => {
        if (!file.endsWith(".mdx")) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(resolve("articles"));
      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}
