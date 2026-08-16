import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { CoreControl } from '../../forms/core-control';

/**
 * Labels a projected core form control and renders its hint and validation
 * error.
 *
 * The control is found through content projection (it provides itself as
 * `CoreControl`), so usage stays flat:
 *
 * ```html
 * <core-form-field label="Email" hint="We never share it.">
 *   <core-input type="email" formControlName="email" />
 * </core-form-field>
 * ```
 *
 * Error text comes from the control's own validation state; `error` overrides
 * it for server-side failures that no validator knows about.
 */
@Component({
  selector: 'core-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="core-field" [class.invalid]="showError()">
      @if (label()) {
        <label class="core-field-label" [attr.for]="controlId()">
          {{ label() }}
          @if (isRequired()) {
            <span class="core-field-required" aria-hidden="true">*</span>
          }
        </label>
      }

      <ng-content />

      @if (showError()) {
        <p class="core-field-error" [id]="errorId()">{{ errorMessage() }}</p>
      } @else if (hint()) {
        <p class="core-field-hint" [id]="hintId()">{{ hint() }}</p>
      }
    </div>
  `,
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  readonly label = input('');
  readonly hint = input('');
  /**
   * Forces the required marker. Left unset it follows the bound control, which
   * detects `Validators.required` — reactive forms only, since the
   * template-driven `required` attribute registers a different validator
   * instance that `hasValidator` cannot match.
   */
  readonly required = input<boolean | undefined>(undefined);
  /** Overrides the control's own error message. */
  readonly error = input('');

  private readonly control = contentChild(CoreControl);

  protected readonly controlId = computed(() => this.control()?.controlId() ?? null);
  protected readonly isRequired = computed(
    () => this.required() ?? this.control()?.required() ?? false,
  );
  protected readonly showError = computed(
    () => !!this.error() || (this.control()?.showError() ?? false),
  );
  protected readonly errorMessage = computed(
    () => this.error() || this.control()?.errorText() || null,
  );

  protected readonly hintId = computed(() => `${this.controlId() ?? 'core-field'}-hint`);
  protected readonly errorId = computed(() => `${this.controlId() ?? 'core-field'}-error`);

  constructor() {
    // The hint and error live here, but the element they describe lives in the
    // projected control — so the ids have to be pushed back down to it.
    effect(() => {
      const control = this.control();
      if (!control) {
        return;
      }
      const described = this.showError() ? this.errorId() : this.hint() ? this.hintId() : null;
      control.describedBy.set(described);
    });
  }
}
