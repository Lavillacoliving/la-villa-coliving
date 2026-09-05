/**
 * Charge la source unique TypeScript `src/data/entityFacts.ts` (+ `entityFactsArticles.ts`) depuis Node (scripts CI), sans build
 * complet : esbuild (déjà présent via Vite) la bundle en mémoire avec ses imports relatifs
 * (`./stats`, `../lib/structuredData`, alias `@/` → src/) puis on l'importe en data: URL.
 * Utilisé par scripts/check-entity-facts.mjs et scripts/build-llms-txt.mjs.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..', '..');

let cached = null;
export async function loadEntityFacts() {
  if (cached) return cached;
  const result = await build({
    // Point d'entrée virtuel : la fiche + l'allowlist des 8 articles porteurs (entityFactsArticles.ts).
    stdin: {
      contents: "export * from './src/data/entityFacts'; export * from './src/data/entityFactsArticles';",
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    alias: { '@': path.join(ROOT, 'src') },
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  cached = await import(`data:text/javascript;base64,${Buffer.from(code, 'utf8').toString('base64')}`);
  return cached;
}
