import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { CoreControl } from '../../forms/core-control';
import { FormControlBase } from '../../forms/form-control-base';

/**
 * Boolean checkbox. Its own `label` sits beside the box, where a checkbox
 * label belongs; a wrapping `core-form-field` then adds only the hint and
 * error (leave the wrapper's `label` unset to avoid labelling it twice).
 */
@Component({
  selector: 'core-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CoreControl, useExisting: forwardRef(() => CheckboxComponent) }],
  template: `
    <label class="core-checkbox" [attr.for]="controlId()">
      <input
        type="checkbox"
        [id]="controlId()"
        [checked]="value() === true"
        [disabled]="isDisabled()"
        [attr.required]="required() ? '' : null"
        [attr.aria-invalid]="showError() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        (change)="onToggle($event)"
        (blur)="markTouched()"
      />
      <span>{{ label() }}</span>
    </label>
  `,
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent extends FormControlBase<boolean> {
  readonly label = input('');

  protected onToggle(event: Event): void {
    this.setValue((event.target as HTMLInputElement).checked);
  }
}
