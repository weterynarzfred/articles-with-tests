import { readdirSync, existsSync } from "fs";
import { resolve, join, basename, extname } from "path";
import sharp from "sharp";

const WIDTHS = [256, 384, 512, 768, 1024, 1536, 2048];
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIRTUAL_ID = "virtual:image-sizes";
const RESOLVED_ID = "\0virtual:image-sizes";
const QUALITY = 75;

function srcDir() {
  return resolve("public", "articles");
}

function imageFiles() {
  const dir = srcDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .map(f => ({ file: f, path: join(dir, f) }));
}

async function buildSizesMap() {
  const map = {};
  for (const { file, path } of imageFiles()) {
    const { width } = await sharp(path).metadata();
    map[`articles/${file}`] = width;
  }
  return map;
}

export default function imagesPlugin() {
  let sizesMap = null;

  return {
    name: "vite-plugin-images",

    async buildStart() {
      sizesMap = await buildSizesMap();
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;
      if (!sizesMap) sizesMap = await buildSizesMap();
      return `export default ${JSON.stringify(sizesMap)};`;
    },

    async generateBundle() {
      for (const { file, path } of imageFiles()) {
        const name = basename(file, extname(file));
        const { width: origWidth } = await sharp(path).metadata();

        for (const w of WIDTHS) {
          if (w > origWidth) continue;
          const buffer = await sharp(path)
            .resize(w, null, { withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer();
          this.emitFile({ type: "asset", fileName: `articles/${name}-${w}.webp`, source: buffer });
        }
      }
    },

    configureServer(server) {
      server.watcher.add(srcDir());
      server.watcher.on("add", file => {
        if (IMAGE_EXTS.has(extname(file).toLowerCase())) {
          sizesMap = null;
          const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
      });
    },
  };
}
