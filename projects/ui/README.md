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
| `FormFieldComponent` (`<core-form-field>`) | component | label, required marker, hint + error for a projected control |
| `InputComponent` (`<core-input>`) | component | `type` text/email/password/number/date, `placeholder` |
| `TextareaComponent` (`<core-textarea>`) | component | `rows`, `placeholder` |
| `SelectComponent` (`<core-select>`) | component | typed `options: CoreOption<T>[]`, `placeholder` |
| `CheckboxComponent` (`<core-checkbox>`) | component | boolean, own inline `label` |
| `RadioGroupComponent` (`<core-radio-group>`) | component | typed `options`, `orientation` vertical/horizontal |
| `AutofocusDirective` (`[coreAutofocus]`) | directive | focuses the host after first render |
| `InitialsPipe` (`coreInitials`) | pipe | "Jane Doe" → "JD", optional word limit |
| `TruncatePipe` (`coreTruncate`) | pipe | length limit + custom ellipsis |

## Usage

```ts
import { ButtonComponent, CardComponent, InitialsPipe } from '@w-industries-luke/core-ui';

@Component({ imports: [ButtonComponent, CardComponent, InitialsPipe], ... })
```

## Form controls

Every control is a `ControlValueAccessor`, so it binds with `[formControl]`,
`formControlName` or `[(ngModel)]` like a native element. Wrap one in
`<core-form-field>` for its label, hint and error:

```html
<core-form-field label="Email" hint="We never share it.">
  <core-input type="email" formControlName="email" />
</core-form-field>
```

The wrapper reads the bound control's own validation state — the required marker
follows `Validators.required`, and the error appears once the control is invalid
*and* touched. Set `error` to show a server-side message instead.

### Floating labels

`appearance="float"` rests the label inside the control and lifts it to the top
edge on focus or once there is a value:

```html
<core-form-field label="Email" appearance="float">
  <core-input type="email" formControlName="email" />
</core-form-field>
```

It is driven by the control's own `focused`/`hasValue` signals rather than the
usual `:placeholder-shown` CSS trick, which cannot see a `<select>` (never
"placeholder shown") or a `type="date"` (always rendering a format mask). Each
control declares how it behaves via `floatBehavior`:

| Behavior | Controls | Label |
| --- | --- | --- |
| `auto` | input (except date), textarea | rests inside, floats on focus/value |
| `always` | select, `type="date"` | stays floated — the element always shows content |
| `never` | checkbox, radio group | stays stacked; they carry their own labels |

`stacked` remains the default, so existing fields are unaffected.

Error text comes from `CORE_ERROR_MESSAGES`, a map of validation-error key to
message. Re-provide it to reword or extend:

```ts
providers: [
  {
    provide: CORE_ERROR_MESSAGES,
    useValue: { ...defaultErrorMessages, required: 'We need this one.' },
  },
];
```

Two notes worth knowing:

- The required marker detects `Validators.required` by identity, so it works for
  reactive forms; the template-driven `required` attribute registers a different
  validator instance, so set `[required]="true"` on the field there.
- `<core-select>` and `<core-radio-group>` round-trip option values by index, so
  a `CoreOption<number>` gives the bound control a `number` — not the option
  element's string.

## Development

```bash
npm test              # jest (100% coverage enforced)
npm run build         # ng-packagr -> dist/ui
cd dist/ui && npm publish   # GitHub Packages (needs GITHUB_TOKEN with packages:write)
```
