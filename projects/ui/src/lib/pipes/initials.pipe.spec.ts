import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  const pipe = new InitialsPipe();

  it('takes the first letter of the first two words', () => {
    expect(pipe.transform('Jane Doe')).toBe('JD');
  });

  it('uppercases single-word names', () => {
    expect(pipe.transform('jane')).toBe('J');
  });

  it('honors a custom word limit', () => {
    expect(pipe.transform('Mary Jane Watson', 3)).toBe('MJW');
  });

  it('ignores extra whitespace', () => {
    expect(pipe.transform('  Jane   Doe  ')).toBe('JD');
  });

  it('returns an empty string for null, undefined, or empty input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
