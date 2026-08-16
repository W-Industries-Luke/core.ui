import { InjectionToken, Signal, WritableSignal } from '@angular/core';

/**
 * The contract a form control exposes to `core-form-field`.
 *
 * Controls provide themselves under this token so the wrapper can label them,
 * mirror their validation state, and point their `aria-describedby` at the
 * hint/error it renders. It is deliberately non-generic: the wrapper never
 * touches the value, only the presentation state around it.
 */
export abstract class CoreControl {
  /** Id of the focusable element, for the wrapper's `<label for>`. */
  abstract readonly controlId: Signal<string>;
  /** Whether the bound control carries a `required` validator. */
  abstract readonly required: Signal<boolean>;
  /** Invalid *and* touched — i.e. worth showing an error for. */
  abstract readonly showError: Signal<boolean>;
  /** The first validation error, rendered through {@link CORE_ERROR_MESSAGES}. */
  abstract readonly errorText: Signal<string | null>;
  /** Set by the wrapper with the ids of the hint/error it renders. */
  abstract readonly describedBy: WritableSignal<string | null>;
}

/** A message for one validation error key: static text, or built from the error. */
export type CoreErrorMessage = string | ((error: unknown) => string);

/** Validation error key -> message. */
export type CoreErrorMessages = Readonly<Record<string, CoreErrorMessage>>;

/** Reads a numeric member off an unknown validation error payload. */
function numberFrom(error: unknown, key: string): number | null {
  if (typeof error !== 'object' || error === null || !(key in error)) {
    return null;
  }
  const value = (error as Record<string, unknown>)[key];
  return typeof value === 'number' ? value : null;
}

function characters(count: number): string {
  return `${count} character${count === 1 ? '' : 's'}`;
}

/**
 * Messages for the validators Angular ships. Apps override the whole map, or
 * merge into it, by re-providing {@link CORE_ERROR_MESSAGES}.
 */
export const defaultErrorMessages: CoreErrorMessages = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  minlength: (error) => {
    const required = numberFrom(error, 'requiredLength');
    return required === null
      ? 'This field is too short.'
      : `Enter at least ${characters(required)}.`;
  },
  maxlength: (error) => {
    const required = numberFrom(error, 'requiredLength');
    return required === null ? 'This field is too long.' : `Enter at most ${characters(required)}.`;
  },
  min: (error) => {
    const min = numberFrom(error, 'min');
    return min === null ? 'This value is too small.' : `Enter ${min} or more.`;
  },
  max: (error) => {
    const max = numberFrom(error, 'max');
    return max === null ? 'This value is too large.' : `Enter ${max} or less.`;
  },
  pattern: 'This value is not in the expected format.',
};

export const CORE_ERROR_MESSAGES = new InjectionToken<CoreErrorMessages>('CORE_ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => defaultErrorMessages,
});
