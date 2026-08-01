import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md';

/**
 * Shared button. Colors, radii, and typography come from the
 * `@w-industries-luke/core-themes` CSS custom properties, with sensible
 * fallbacks when no theme stylesheet is loaded.
 */
@Component({
  selector: 'core-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [type]="type()" [class]="classes()" [disabled]="disabled()">
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');

  protected readonly classes = computed(() => `core-btn ${this.variant()} ${this.size()}`);
}
