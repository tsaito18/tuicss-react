import { describe, it, expect, afterEach, vi } from 'vitest';

// jsdom はレイアウトを行わないため clientWidth が常に 0 になる。
// テストごとに現実的なスクロールバー幅(20px)を再現するため明示的にスタブする。
function stubScrollbarWidth(width: number) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: 1024 - width,
    configurable: true,
  });
  window.innerWidth = 1024;
}

afterEach(() => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

describe('bodyScrollLock', () => {
  it('sets overflow: hidden and adds the scrollbar width to padding-right on a single lock', async () => {
    vi.resetModules();
    const { lockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);

    lockBodyScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');
  });

  it('adds to an existing inline padding-right while locked and restores it exactly after unlock', async () => {
    vi.resetModules();
    const { lockBodyScroll, unlockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);
    document.body.style.paddingRight = '10px';

    lockBodyScroll();
    expect(document.body.style.paddingRight).toBe('30px');

    unlockBodyScroll();
    expect(document.body.style.paddingRight).toBe('10px');
  });

  it('restores overflow and paddingRight to empty string when there were no prior inline styles', async () => {
    vi.resetModules();
    const { lockBodyScroll, unlockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);

    lockBodyScroll();
    unlockBodyScroll();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('keeps the body locked through a nested lock/unlock pair and releases on the matching unlock', async () => {
    vi.resetModules();
    const { lockBodyScroll, unlockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);

    lockBodyScroll();
    lockBodyScroll();
    unlockBodyScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');

    unlockBodyScroll();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('does not double-add padding on a second nested lock', async () => {
    vi.resetModules();
    const { lockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);

    lockBodyScroll();
    lockBodyScroll();

    expect(document.body.style.paddingRight).toBe('20px');
  });

  it('leaves padding-right untouched when scrollbarWidth is 0', async () => {
    vi.resetModules();
    const { lockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(0);

    lockBodyScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('is a harmless no-op when unlockBodyScroll is called without a preceding lock', async () => {
    vi.resetModules();
    const { lockBodyScroll, unlockBodyScroll } = await import('./bodyScrollLock');
    stubScrollbarWidth(20);

    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('');

    lockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');

    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });
});
