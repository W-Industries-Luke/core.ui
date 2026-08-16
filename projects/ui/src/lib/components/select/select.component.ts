import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { CoreControl } from '../../forms/core-control';
import { FormControlBase } from '../../forms/form-control-base';

/** One choice in a `core-select` or `core-radio-group`. */
export interface CoreOption<T> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

/**
 * Dropdown over a typed option list.
 *
 * Option values round-trip by *index*, not by their stringified form: a native
 * `<option value>` is always a string, so binding the value directly would hand
 * back `"1"` for a numeric option and `"[object Object]"` for an object one.
 */
@Component({
  selector: 'core-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CoreControl, useExisting: forwardRef(() => SelectComponent) }],
  template: `
    <select
      class="core-select"
      [id]="controlId()"
      [disabled]="isDisabled()"
      [attr.required]="required() ? '' : null"
      [attr.aria-invalid]="showError() ? 'true' : null"
      [attr.aria-describedby]="describedBy()"
      (change)="onChangeEvent($event)"
      (blur)="markTouched()"
    >
      @if (placeholder()) {
        <option value="" [selected]="selectedIndex() === null" disabled>{{ placeholder() }}</option>
      }
      @for (option of options(); track $index) {
        <option
          [value]="$index"
          [selected]="selectedIndex() === $index"
          [disabled]="option.disabled ?? false"
        >
          {{ option.label }}
        </option>
      }
    </select>
  `,
  styleUrl: './select.component.scss',
})
export class SelectComponent<T> extends FormControlBase<T> {
  readonly options = input<readonly CoreOption<T>[]>([]);
  /** Shown as a disabled leading option while nothing is selected. */
  readonly placeholder = input('');

  protected readonly selectedIndex = computed(() => {
    const current = this.value();
    const index = this.options().findIndex((option) => option.value === current);
    return index === -1 ? null : index;
  });

  protected onChangeEvent(event: Event): void {
    // An empty value means no option is selected (`selectedIndex === -1`), which
    // must not be read as index 0 — `Number('')` is 0.
    const raw = (event.target as HTMLSelectElement).value;
    const option = raw === '' ? undefined : this.options()[Number(raw)];
    this.setValue(option ? option.value : null);
  }
}
