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

## Development

```bash
npm test              # jest (100% coverage enforced)
npm run build         # ng-packagr -> dist/ui
cd dist/ui && npm publish   # GitHub Packages (needs GITHUB_TOKEN with packages:write)
```
