import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypeSlug from "rehype-slug";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, remarkSmartypants],
      rehypePlugins: [rehypeSlug],
      providerImportSource: "@mdx-js/react",
    }),
    react(),
  ],
  base: '/articles-with-tests/',
});
