import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { CoreControl, FloatBehavior } from '../../forms/core-control';
import { FormControlBase } from '../../forms/form-control-base';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date';

/**
 * Single-line text input. Wrap in `core-form-field` for a label, hint and
 * error; on its own it is just the styled, form-bound control.
 *
 * `type="number"` reads and writes `number | null` rather than the element's
 * string value, so a bound control holds the type the rest of the app expects.
 */
@Component({
  selector: 'core-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CoreControl, useExisting: forwardRef(() => InputComponent) }],
  template: `
    <input
      class="core-input"
      [class.float]="floating()"
      [id]="controlId()"
      [type]="type()"
      [value]="displayValue()"
      [placeholder]="placeholder()"
      [disabled]="isDisabled()"
      [attr.required]="required() ? '' : null"
      [attr.aria-invalid]="showError() ? 'true' : null"
      [attr.aria-describedby]="describedBy()"
      (input)="onInput($event)"
      (focus)="onFocus()"
      (blur)="onBlur()"
    />
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent extends FormControlBase<string | number> {
  readonly type = input<InputType>('text');
  readonly placeholder = input('');

  /** A date input always renders its own format mask, so a resting label
   *  would sit on top of it. */
  protected override floatMode(): FloatBehavior {
    return this.type() === 'date' ? 'always' : 'auto';
  }

  protected readonly displayValue = computed(() => {
    const value = this.value();
    return value === null || value === undefined ? '' : String(value);
  });

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    if (this.type() !== 'number') {
      this.setValue(raw);
      return;
    }
    // An empty or half-typed number ('-', '1e') has no meaningful numeric
    // value; null keeps `required` meaningful instead of reporting NaN.
    this.setValue(raw === '' || Number.isNaN(Number(raw)) ? null : Number(raw));
  }
}
