import { describe, it, expect } from 'vitest';
import {
  borderClass,
  shadowClass,
  scrollbarClass,
} from './utilityClasses';

describe('borderClass', () => {
  it('maps each border style to its tui-border-* class', () => {
    expect(borderClass('solid')).toBe('tui-border-solid');
    expect(borderClass('double')).toBe('tui-border-double');
    expect(borderClass('dotted')).toBe('tui-border-dotted');
    expect(borderClass('dashed')).toBe('tui-border-dashed');
  });
});

describe('shadowClass', () => {
  it('returns the base right-shadow class with no input', () => {
    expect(shadowClass()).toBe('tui-shadow');
    expect(shadowClass({})).toBe('tui-shadow');
  });

  it('returns the base left-shadow class for the left direction', () => {
    expect(shadowClass({ direction: 'left' })).toBe('tui-shadow-left');
  });

  it('appends the level for right shadows', () => {
    expect(shadowClass({ level: 1 })).toBe('tui-shadow-1');
    expect(shadowClass({ level: 3 })).toBe('tui-shadow-3');
    expect(shadowClass({ level: 5 })).toBe('tui-shadow-5');
  });

  it('appends the level for left shadows', () => {
    expect(shadowClass({ direction: 'left', level: 2 })).toBe(
      'tui-shadow-left-2',
    );
    expect(shadowClass({ direction: 'left', level: 5 })).toBe(
      'tui-shadow-left-5',
    );
  });

  it('returns tui-no-shadow when none is set, ignoring other fields', () => {
    expect(shadowClass({ none: true })).toBe('tui-no-shadow');
    expect(shadowClass({ none: true, direction: 'left', level: 4 })).toBe(
      'tui-no-shadow',
    );
  });
});

describe('scrollbarClass', () => {
  it('maps each color to its tui-scroll-* class', () => {
    expect(scrollbarClass('cyan')).toBe('tui-scroll-cyan');
    expect(scrollbarClass('blue')).toBe('tui-scroll-blue');
    expect(scrollbarClass('green')).toBe('tui-scroll-green');
    expect(scrollbarClass('red')).toBe('tui-scroll-red');
    expect(scrollbarClass('purple')).toBe('tui-scroll-purple');
    expect(scrollbarClass('yellow')).toBe('tui-scroll-yellow');
    expect(scrollbarClass('white')).toBe('tui-scroll-white');
  });
});
