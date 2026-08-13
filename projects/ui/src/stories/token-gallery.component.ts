import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

export type TokenPreview = 'color' | 'radius' | 'shadow' | 'font';

/**
 * Renders a list of `--core-*` tokens by reading their *computed* values off
 * the document root, so the gallery always shows what the loaded stylesheet
 * actually resolves to rather than a hand-maintained copy. Re-reads whenever
 * the root class changes, which is how the Storybook theme toolbar switches
 * between the light and dark scales.
 *
 * Story-only helper — deliberately not exported from the package's public API.
 */
@Component({
  selector: 'core-token-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      @for (token of tokens(); track token) {
        <div class="token">
          <div class="preview" [style]="previewStyle(token)">
            @if (preview() === 'font') {
              <span class="sample">Ag</span>
            }
          </div>
          <div class="meta">
            <code class="name">--core-{{ token }}</code>
            <code class="value">{{ values()[token] || '—' }}</code>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
      gap: 0.75rem;
    }

    .token {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 0.625rem;
      border: 1px solid var(--core-color-border-subtle);
      border-radius: var(--core-radius-md);
      background: var(--core-color-surface);
    }

    .preview {
      flex: 0 0 auto;
      width: 3rem;
      height: 3rem;
      border: 1px solid var(--core-color-border);
      border-radius: var(--core-radius-sm);
      display: grid;
      place-items: center;
      overflow: hidden;
    }

    .sample {
      font-size: 1.25rem;
      color: var(--core-color-text);
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }

    .name {
      font-size: 0.75rem;
      color: var(--core-color-text);
      overflow-wrap: anywhere;
    }

    .value {
      font-size: 0.6875rem;
      color: var(--core-color-text-muted);
      overflow-wrap: anywhere;
    }
  `,
})
export class TokenGalleryComponent {
  /** Token names without the `--core-` prefix, e.g. `color-primary`. */
  readonly tokens = input<readonly string[]>([]);
  /** How to render the swatch for each token. */
  readonly preview = input<TokenPreview>('color');

  protected readonly values = signal<Record<string, string>>({});

  private readonly host = inject(ElementRef).nativeElement as HTMLElement;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.read();

      // The theme toolbar toggles a class on <html>; recompute when it does.
      const observer = new MutationObserver(() => this.read());
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected previewStyle(token: string): Record<string, string> {
    const reference = `var(--core-${token})`;
    switch (this.preview()) {
      case 'color':
        return { background: reference };
      case 'radius':
        return { 'border-radius': reference, background: 'var(--core-color-accent-bg)' };
      case 'shadow':
        return { 'box-shadow': reference, background: 'var(--core-color-surface)' };
      case 'font':
        return { 'font-family': reference, background: 'var(--core-color-surface)' };
    }
  }

  private read(): void {
    // Read from the host, not the document root, so a gallery inside a
    // `core-theme-*` scope reports that scope's values.
    const computed = getComputedStyle(this.host);
    const next: Record<string, string> = {};
    for (const token of this.tokens()) {
      next[token] = computed.getPropertyValue(`--core-${token}`).trim();
    }
    this.values.set(next);
  }
}
