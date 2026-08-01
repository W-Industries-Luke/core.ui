import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Shared content card with an optional title header, themed via core-themes tokens. */
@Component({
  selector: 'core-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="core-card">
      @if (title()) {
        <header class="core-card-header">{{ title() }}</header>
      }
      <div class="core-card-body">
        <ng-content />
      </div>
    </section>
  `,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly title = input('');
}
