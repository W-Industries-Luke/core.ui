import { defaultErrorMessages } from './core-control';

/** Resolves a message entry, which may be static text or built from the error. */
function message(key: string, error: unknown): string {
  const entry = defaultErrorMessages[key];
  return typeof entry === 'function' ? entry(error) : entry;
}

describe('defaultErrorMessages', () => {
  it('states the static messages', () => {
    expect(message('required', true)).toBe('This field is required.');
    expect(message('email', true)).toBe('Enter a valid email address.');
    expect(message('pattern', {})).toBe('This value is not in the expected format.');
  });

  it('builds length messages from the validator payload', () => {
    expect(message('minlength', { requiredLength: 5, actualLength: 2 })).toBe(
      'Enter at least 5 characters.',
    );
    expect(message('maxlength', { requiredLength: 10, actualLength: 12 })).toBe(
      'Enter at most 10 characters.',
    );
  });

  it('keeps the character count grammatical', () => {
    expect(message('minlength', { requiredLength: 1 })).toBe('Enter at least 1 character.');
  });

  it('builds range messages from the validator payload', () => {
    expect(message('min', { min: 3, actual: 1 })).toBe('Enter 3 or more.');
    expect(message('max', { max: 9, actual: 12 })).toBe('Enter 9 or less.');
  });

  it('falls back to generic wording when the payload is not the expected shape', () => {
    // A custom validator is free to emit any payload under a standard key.
    expect(message('minlength', true)).toBe('This field is too short.');
    expect(message('maxlength', null)).toBe('This field is too long.');
    expect(message('min', {})).toBe('This value is too small.');
    expect(message('max', { max: 'nine' })).toBe('This value is too large.');
  });
});
