import { DestroyRef, Directive, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { CORE_ERROR_MESSAGES, CoreControl, FloatBehavior } from './core-control';

let nextUniqueId = 0;

/**
 * Shared `ControlValueAccessor` plumbing for the core form controls.
 *
 * The `NgControl` is injected with `{ self: true }` and wired by assigning
 * `valueAccessor` in the constructor rather than providing `NG_VALUE_ACCESSOR`
 * — the token is what the forms directive on the *same element*
 * (`[formControl]`, `formControlName`, `[(ngModel)]`) resolves, and assigning
 * it directly avoids the circular dependency the provider form creates.
 *
 * Validation state is exposed as signals so `core-form-field` can render off
 * it. `AbstractControl.events` is the one stream that covers value, status,
 * *and* touched transitions; touched in particular has no other notification,
 * and an error that only appears after blur needs it.
 */
@Directive()
export abstract class FormControlBase<T>
  extends CoreControl
  implements ControlValueAccessor, OnInit
{
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly messages = inject(CORE_ERROR_MESSAGES);
  private readonly destroyRef = inject(DestroyRef);

  /** Explicit id for the focusable element; defaults to a generated one. */
  readonly id = input('');
  /** Disables the control independently of the form's own disabled state. */
  readonly disabled = input(false);

  private readonly uid = `core-control-${nextUniqueId++}`;
  readonly controlId = computed(() => this.id() || this.uid);

  protected readonly value = signal<T | null>(null);
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  readonly describedBy = signal<string | null>(null);
  readonly focused = signal(false);
  readonly floating = signal(false);

  readonly hasValue = computed(() => {
    const value = this.value();
    return value !== null && value !== undefined && value !== '';
  });

  readonly floatBehavior = computed(() => this.floatMode());

  /**
   * Overridden by controls whose element renders content of its own, or that
   * carry their own label. See {@link FloatBehavior}.
   */
  protected floatMode(): FloatBehavior {
    return 'auto';
  }

  /**
   * Bumped on every control event. Reading it inside the state computeds makes
   * them recompute on change, since `AbstractControl` is not signal-based.
   */
  private readonly revision = signal(0);

  readonly required = computed(() => {
    this.revision();
    return this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  });

  readonly invalid = computed(() => {
    this.revision();
    return this.ngControl?.control?.invalid ?? false;
  });

  readonly touched = computed(() => {
    this.revision();
    return this.ngControl?.control?.touched ?? false;
  });

  readonly showError = computed(() => this.invalid() && this.touched());

  readonly errorText = computed(() => {
    this.revision();
    const errors = this.ngControl?.control?.errors;
    if (!errors) {
      return null;
    }
    const [key, detail] = Object.entries(errors)[0];
    const message = this.messages[key];
    if (message === undefined) {
      return null;
    }
    return typeof message === 'function' ? message(detail) : message;
  });

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    super();
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) {
      return;
    }
    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.revision.update((revision) => revision + 1);
    });
  }

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  /** Publishes a new value to both the template and the bound form control. */
  protected setValue(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  /** Marks the control touched — call from the element's `blur`. */
  protected markTouched(): void {
    this.onTouched();
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.markTouched();
  }
}
