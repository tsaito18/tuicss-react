import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('warnIfTuiStylesMissing', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('warns when the class has no styles loaded (jsdom default computes display: block)', async () => {
    const { warnIfTuiStylesMissing } = await import('./tuiStyleCheck');

    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('warns only once even across multiple calls with different componentName/className', async () => {
    const { warnIfTuiStylesMissing } = await import('./tuiStyleCheck');

    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });
    warnIfTuiStylesMissing({ className: 'tui-sidenav', componentName: 'Sidenav' });
    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('does not warn when the class computes to display: none', async () => {
    const style = document.createElement('style');
    style.textContent = '.tui-modal{display:none}';
    document.head.appendChild(style);

    const { warnIfTuiStylesMissing } = await import('./tuiStyleCheck');

    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('removes the probe element from the DOM afterwards', async () => {
    const bodyChildrenBefore = document.body.children.length;
    const { warnIfTuiStylesMissing } = await import('./tuiStyleCheck');

    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });

    expect(document.body.children.length).toBe(bodyChildrenBefore);
    expect(document.body.querySelector('.tui-modal')).toBeNull();
  });

  it('includes the component name and the stylesheet path in the warning message', async () => {
    const { warnIfTuiStylesMissing } = await import('./tuiStyleCheck');

    warnIfTuiStylesMissing({ className: 'tui-modal', componentName: 'Modal' });

    const message = warnSpy.mock.calls[0]?.[0] as string;
    expect(message).toContain('Modal');
    expect(message).toContain('@tsaito18/tuicss-react/styles.css');
  });
});
