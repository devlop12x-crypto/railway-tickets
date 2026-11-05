import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';

/**
 * GitHub Pages не умеет отдавать одну страницу на все пути SPA.
 * Плагин кладёт копии index.html под именами страниц: Pages отдаёт /trains
 * из trains.html с кодом 200, поэтому прямой заход и перезагрузка работают.
 * 404.html — запасной вход для всех остальных адресов.
 */
export function spaFallback(pages: readonly string[]): Plugin {
  let outDir = 'dist';

  return {
    name: 'spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const index = join(outDir, 'index.html');
      await Promise.all(
        [...pages.map((page) => `${page}.html`), '404.html'].map((file) =>
          copyFile(index, join(outDir, file)),
        ),
      );
    },
  };
}
