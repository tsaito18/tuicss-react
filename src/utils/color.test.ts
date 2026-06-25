import { describe, it, expect } from 'vitest';
import { tuiColorClasses, tuiColor } from './color';

describe('tuiColorClasses', () => {
  it('returns an empty string for empty input', () => {
    expect(tuiColorClasses({})).toBe('');
  });

  it('generates a background class from a token unchanged', () => {
    expect(tuiColorClasses({ bg: 'blue-168' })).toBe('blue-168');
  });

  it('appends -text for the text slot', () => {
    expect(tuiColorClasses({ text: 'white' })).toBe('white-text');
  });

  it('appends -border for the border slot', () => {
    expect(tuiColorClasses({ border: 'red-255' })).toBe('red-255-border');
  });

  it('handles hover variants for each slot', () => {
    expect(
      tuiColorClasses({
        bgHover: 'green-255',
        textHover: 'cyan-168',
        borderHover: 'yellow-255',
      }),
    ).toBe('green-255-hover cyan-168-text-hover yellow-255-border-hover');
  });

  it('supports semantic theme tokens without intensity', () => {
    expect(
      tuiColorClasses({ bg: 'primary', text: 'danger', border: 'success' }),
    ).toBe('primary danger-text success-border');
  });

  it('treats black/white as intensity-free tokens', () => {
    expect(tuiColorClasses({ bg: 'black', text: 'white' })).toBe(
      'black white-text',
    );
  });

  it('combines every slot in a stable order', () => {
    expect(
      tuiColorClasses({
        bg: 'blue-168',
        text: 'white',
        border: 'red-255',
        bgHover: 'blue-255',
        textHover: 'white',
        borderHover: 'red-168',
      }),
    ).toBe(
      'blue-168 white-text red-255-border blue-255-hover white-text-hover red-168-border-hover',
    );
  });
});

describe('tuiColor builders', () => {
  it('produces each variant class for a single token', () => {
    expect(tuiColor.bg('blue-168')).toBe('blue-168');
    expect(tuiColor.text('blue-168')).toBe('blue-168-text');
    expect(tuiColor.border('blue-168')).toBe('blue-168-border');
    expect(tuiColor.bgHover('blue-168')).toBe('blue-168-hover');
    expect(tuiColor.textHover('blue-168')).toBe('blue-168-text-hover');
    expect(tuiColor.border('orange-255')).toBe('orange-255-border');
  });
});
