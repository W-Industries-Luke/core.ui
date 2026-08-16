import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { CoreControl } from '../../forms/core-control';
import { FormControlBase } from '../../forms/form-control-base';
import { CoreOption } from '../select/select.component';

/**
 * A single-choice radio group over a typed option list.
 *
 * `controlId` lands on the first radio so a wrapping `core-form-field`'s
 * `<label for>` focuses the group; the group itself is announced through
 * `role="radiogroup"`.
 */
@Component({
  selector: 'core-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CoreControl, useExisting: forwardRef(() => RadioGroupComponent) }],
  template: `
    <div
      class="core-radio-group"
      [class.horizontal]="orientation() === 'horizontal'"
      role="radiogroup"
      [attr.aria-invalid]="showError() ? 'true' : null"
      [attr.aria-describedby]="describedBy()"
    >
      @for (option of options(); track $index) {
        <label class="core-radio">
          <input
            type="radio"
            [attr.id]="$first ? controlId() : null"
            [name]="groupName()"
            [checked]="option.value === value()"
            [disabled]="isDisabled() || (option.disabled ?? false)"
            (change)="select(option.value)"
            (blur)="markTouched()"
          />
          <span>{{ option.label }}</span>
        </label>
      }
    </div>
  `,
  styleUrl: './radio-group.component.scss',
})
export class RadioGroupComponent<T> extends FormControlBase<T> {
  readonly options = input<readonly CoreOption<T>[]>([]);
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');

  /** Radios only behave as one group if they share a `name`. */
  protected readonly groupName = computed(() => `${this.controlId()}-group`);

  protected select(value: T): void {
    this.setValue(value);
  }
}
