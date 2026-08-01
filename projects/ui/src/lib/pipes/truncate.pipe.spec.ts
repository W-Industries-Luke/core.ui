import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('returns short text unchanged', () => {
    expect(pipe.transform('short', 25)).toBe('short');
  });

  it('truncates long text and appends an ellipsis', () => {
    expect(pipe.transform('a very long piece of text indeed', 10)).toBe('a very lon…');
  });

  it('trims trailing whitespace before the ellipsis', () => {
    expect(pipe.transform('one two three', 4)).toBe('one…');
  });

  it('honors a custom ellipsis', () => {
    expect(pipe.transform('abcdefgh', 3, '...')).toBe('abc...');
  });

  it('returns an empty string for null, undefined, or empty input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
