import { createRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

function BasicTabs(props: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={props.defaultValue}>
      <TabList>
        <Tab value="tab-1">Tab 1</Tab>
        <Tab value="tab-2">Tab 2</Tab>
        <Tab value="tab-3" disabled>
          Tab 3
        </Tab>
      </TabList>
      <TabPanel value="tab-1">Panel 1</TabPanel>
      <TabPanel value="tab-2">Panel 2</TabPanel>
      <TabPanel value="tab-3">Panel 3</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders the TuiCss DOM structure: div.tui-tabs > ul > li > a.tui-tab', () => {
    const { container } = render(<BasicTabs />);
    const tabs = container.querySelector('div.tui-tabs > ul');
    expect(tabs).not.toBeNull();
    const anchors = tabs!.querySelectorAll(':scope > li > a.tui-tab');
    expect(anchors).toHaveLength(3);
  });

  it('activates the first tab and shows only its panel when no defaultValue is given', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('tui-tab', 'active');
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel 3')).not.toBeInTheDocument();
  });

  it('honors defaultValue for the initial active tab', () => {
    render(<BasicTabs defaultValue="tab-2" />);
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveClass('active');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).not.toHaveClass('active');
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument();
  });

  it('moves the active class and switches the visible panel on click', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveClass('active');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).not.toHaveClass('active');
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument();
  });

  it('keeps the active panel visible (display:block) overriding the global display:none', () => {
    render(<BasicTabs />);
    const panel = screen.getByText('Panel 1');
    expect(panel).toHaveClass('tui-tab-content');
    expect(panel).toHaveStyle({ display: 'block' });
  });

  it('does not activate a disabled tab on click', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));

    expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveClass('disabled');
    expect(screen.getByRole('tab', { name: 'Tab 3' })).not.toHaveClass('active');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('active');
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Panel 3')).not.toBeInTheDocument();
  });

  it('reflects aria-selected on the active tab', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled mode via value + onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('tab-1');
      return (
        <Tabs
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        >
          <TabList>
            <Tab value="tab-1">Tab 1</Tab>
            <Tab value="tab-2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab-1">Panel 1</TabPanel>
          <TabPanel value="tab-2">Panel 2</TabPanel>
        </Tabs>
      );
    }

    render(<Controlled />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('active');

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onValueChange).toHaveBeenCalledWith('tab-2');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveClass('active');
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('does not update on click when controlled value is held fixed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="tab-1" onValueChange={onValueChange}>
        <TabList>
          <Tab value="tab-1">Tab 1</Tab>
          <Tab value="tab-2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab-1">Panel 1</TabPanel>
        <TabPanel value="tab-2">Panel 2</TabPanel>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onValueChange).toHaveBeenCalledWith('tab-2');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('active');
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
  });

  it('merges className and forwards extra props on Tab and TabPanel', () => {
    render(
      <Tabs defaultValue="tab-1">
        <TabList>
          <Tab value="tab-1" className="extra-tab" data-testid="my-tab">
            Tab 1
          </Tab>
        </TabList>
        <TabPanel value="tab-1" className="extra-panel" data-testid="my-panel">
          Panel 1
        </TabPanel>
      </Tabs>,
    );
    const tab = screen.getByTestId('my-tab');
    expect(tab).toHaveClass('tui-tab', 'active', 'extra-tab');
    const panel = screen.getByTestId('my-panel');
    expect(panel).toHaveClass('tui-tab-content', 'extra-panel');
  });

  it('forwards ref to the underlying elements', () => {
    const tabRef = createRef<HTMLAnchorElement>();
    const panelRef = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="tab-1">
        <TabList>
          <Tab value="tab-1" ref={tabRef}>
            Tab 1
          </Tab>
        </TabList>
        <TabPanel value="tab-1" ref={panelRef}>
          Panel 1
        </TabPanel>
      </Tabs>,
    );
    expect(tabRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it('throws when Tab is used outside of Tabs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Tab value="x">Orphan</Tab>)).toThrow(/within <Tabs>/);
    spy.mockRestore();
  });
});
