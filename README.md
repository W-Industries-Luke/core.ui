# @w-industries-luke/core-ui

Core shared Angular components, directives, and pipes for the workspace front ends.
Standalone, zoneless-safe, and themed via the CSS custom properties published by
`@w-industries-luke/core-themes` (with built-in fallbacks, so the package works
without a theme loaded).

## Contents

| Export | Kind | Notes |
| --- | --- | --- |
| `ButtonComponent` (`<core-button>`) | component | `variant` primary/secondary/danger, `size` sm/md, `disabled`, `type` |
| `CardComponent` (`<core-card>`) | component | optional `title` header + projected body |
| `AutofocusDirective` (`[coreAutofocus]`) | directive | focuses the host after first render |
| `InitialsPipe` (`coreInitials`) | pipe | "Jane Doe" → "JD", optional word limit |
| `TruncatePipe` (`coreTruncate`) | pipe | length limit + custom ellipsis |

## Usage

```ts
import { ButtonComponent, CardComponent, InitialsPipe } from '@w-industries-luke/core-ui';

@Component({ imports: [ButtonComponent, CardComponent, InitialsPipe], ... })
```

## Storybook

The design-system showcase: every component, directive, and pipe, plus a **Design
Tokens** section covering all of `@w-industries-luke/core-themes`.

Published to **https://w-industries-luke.github.io/core.ui/** by the `Storybook`
workflow on every push to `master`. Note the site is public even though this
repository is private — don't put anything internal in a story.

```bash
npm run storybook        # dev server on http://localhost:6008
npm run build-storybook  # static build -> storybook-static/
```

Use the **Theme** control in the toolbar to switch between the light and dark
scales. Two things worth knowing:

- The token pages read their values with `getComputedStyle` off the live
  stylesheet rather than restating them, so they cannot drift from `core-themes`.
- The theme is applied by toggling `core-theme-dark` / `core-theme-light` on the
  preview's `<html>`. Those classes also work on any element, so the
  **Light Vs Dark** story scopes a class per panel to show both scales at once.

The theme is a dev-only dependency on the published
`@w-industries-luke/core-themes` package, so a checkout is self-contained (which
is what lets CI build it). Installing needs a GitHub Packages token — see
`.npmrc`. The components ship token fallbacks and render without a theme loaded.

Stories live in `projects/ui/src/stories/`, deliberately outside `src/lib/` so
they stay out of the published package and out of the 100%-coverage gate.

## Development

```bash
npm test              # jest (100% coverage enforced)
npm run build         # ng-packagr -> dist/ui
cd dist/ui && npm publish   # GitHub Packages (needs GITHUB_TOKEN with packages:write)
```
