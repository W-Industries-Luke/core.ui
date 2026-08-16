#!/usr/bin/env node
/**
 * Fails if a library package imports something it does not declare.
 *
 * A library's own app satisfies every import from the workspace `node_modules`,
 * so an undeclared peer is invisible locally and only breaks in a *consumer's*
 * build. `@w-industries-luke/core-ui` shipped 1.0.0 that way — it imported
 * `@angular/forms` without declaring it.
 *
 * Scans every `projects/<name>/package.json` (the ng-packagr libraries) and
 * compares the bare imports in its published sources against its declared
 * peer/dependencies. Specs and stories are excluded: they are not published.
 *
 * Zero dependencies, so CI can run it without installing anything.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const PROJECTS = 'projects';
const EXCLUDED_FILES = ['.spec.ts', '.stories.ts', '.e2e.ts'];
const EXCLUDED_DIRS = ['stories', 'testing', 'node_modules'];
/** Provided by the build, never declared by hand. */
const IGNORED = new Set(['tslib']);

/** Strips comments so prose like `import the value from 'x'` cannot match. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function importsIn(source) {
  const code = stripComments(source);
  const specifiers = [];
  // `import ... from 'x'` / `export ... from 'x'`, side-effect `import 'x'`,
  // and dynamic `import('x')`.
  const patterns = [
    /(?:^|[\s;}])(?:import|export)\b[^;'"]*?\bfrom\s*['"]([^'"]+)['"]/g,
    /(?:^|[\s;}])import\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const [, specifier] of code.matchAll(pattern)) {
      specifiers.push(specifier);
    }
  }
  return specifiers;
}

/** '@angular/core/rxjs-interop' -> '@angular/core'; './thing' -> null. */
function packageOf(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) {
    return null;
  }
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function sourceFiles(dir, found = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }
  for (const entry of entries) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry)) sourceFiles(path, found);
    } else if (entry.endsWith('.ts') && !EXCLUDED_FILES.some((s) => entry.endsWith(s))) {
      found.push(path);
    }
  }
  return found;
}

function libraries() {
  let entries;
  try {
    entries = readdirSync(PROJECTS);
  } catch {
    return [];
  }
  return entries
    .map((name) => ({ name, manifest: join(PROJECTS, name, 'package.json') }))
    .filter(({ manifest }) => {
      try {
        return !!JSON.parse(readFileSync(manifest, 'utf8')).name;
      } catch {
        return false;
      }
    });
}

let failed = false;
const libs = libraries();

if (libs.length === 0) {
  console.log('No projects/<name>/package.json found — nothing to check.');
  process.exit(0);
}

for (const { name, manifest } of libs) {
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  const declared = new Set([
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ]);

  const used = new Map();
  for (const file of sourceFiles(join(PROJECTS, name, 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const specifier of importsIn(source)) {
      const dep = packageOf(specifier);
      if (!dep || dep === pkg.name || IGNORED.has(dep)) continue;
      if (!used.has(dep)) used.set(dep, new Set());
      used.get(dep).add(relative('.', file).split(sep).join('/'));
    }
  }

  const missing = [...used.keys()].filter((dep) => !declared.has(dep)).sort();
  const unused = [...declared].filter((dep) => !used.has(dep) && !IGNORED.has(dep)).sort();

  if (missing.length > 0) {
    failed = true;
    console.error(`\n✖ ${pkg.name} imports packages it does not declare:`);
    for (const dep of missing) {
      const files = [...used.get(dep)].sort();
      const shown = files.slice(0, 3).join(', ');
      const rest = files.length > 3 ? ` (+${files.length - 3} more)` : '';
      console.error(`    ${dep}  —  ${shown}${rest}`);
    }
    console.error(`  Add them to "peerDependencies" in ${manifest}.`);
  } else {
    console.log(`✔ ${pkg.name} — every import is declared`);
  }

  // Not a failure: an over-declared peer is harmless, just noise for consumers.
  if (unused.length > 0) {
    console.log(`  note: declared but unused — ${unused.join(', ')}`);
  }
}

process.exit(failed ? 1 : 0);
