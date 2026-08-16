import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { CoreControl } from '../../forms/core-control';
import { FormControlBase } from '../../forms/form-control-base';

/** Multi-line text input. Wrap in `core-form-field` for label/hint/error. */
@Component({
  selector: 'core-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CoreControl, useExisting: forwardRef(() => TextareaComponent) }],
  template: `
    <textarea
      class="core-textarea"
      [id]="controlId()"
      [rows]="rows()"
      [value]="value() ?? ''"
      [placeholder]="placeholder()"
      [disabled]="isDisabled()"
      [attr.required]="required() ? '' : null"
      [attr.aria-invalid]="showError() ? 'true' : null"
      [attr.aria-describedby]="describedBy()"
      (input)="onInput($event)"
      (blur)="markTouched()"
    ></textarea>
  `,
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent extends FormControlBase<string> {
  readonly rows = input(4);
  readonly placeholder = input('');

  protected onInput(event: Event): void {
    this.setValue((event.target as HTMLTextAreaElement).value);
  }
}
