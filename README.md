# @tsaito18/tuicss-react

React components for [TuiCss](https://github.com/vinibiavatti1/TuiCss) — a retro **MS-DOS / terminal (TUI) style** UI library.

This package wraps the classic TuiCss look and feel in idiomatic, typed React 19 components. It ships with **zero runtime dependencies**, full TypeScript types, and the bundled CSS, fonts, and background images, so you can drop a text-mode interface into any React app.

[![npm version](https://img.shields.io/npm/v/@tsaito18/tuicss-react.svg)](https://www.npmjs.com/package/@tsaito18/tuicss-react)
[![license](https://img.shields.io/npm/l/@tsaito18/tuicss-react.svg)](./LICENSE)

---

## Installation

```bash
pnpm add @tsaito18/tuicss-react
```

React 19 (or newer) is a **peer dependency** — install it alongside if you have not already:

```bash
pnpm add react@">=19" react-dom@">=19"
```

## Setup

Import the stylesheet **once** at the entry point of your app (for example `main.tsx` or your root layout). This is required — without it the components render unstyled:

```ts
import "@tsaito18/tuicss-react/styles.css";
```

The bundled font ("Perfect DOS VGA 437") and background/scrollbar images are referenced from the CSS using relative URLs and are loaded automatically by your bundler — no extra configuration is needed.

## Quick start

```tsx
import "@tsaito18/tuicss-react/styles.css";
import { Window, Button, Input, Fieldset } from "@tsaito18/tuicss-react";

export function App() {
  return (
    <Window>
      <Fieldset legend="Login">
        <label>Username</label>
        <Input placeholder="user" />
        <Button>Sign in</Button>
      </Fieldset>
    </Window>
  );
}
```

Every component forwards standard HTML attributes (`className`, `style`, `id`, event handlers, `ref`, etc.) to its underlying DOM element, so you can extend or override behavior just like a native element.

---

## Components

The package exposes about 24 component families plus helpers. Most are thin, typed wrappers over TuiCss class names; a handful manage internal/controlled state and are documented below.

### Form controls

```tsx
import {
  Input,
  Textarea,
  Checkbox,
  Radio,
  Fieldset,
  Button,
} from "@tsaito18/tuicss-react";

function Form() {
  return (
    <Fieldset legend="Preferences">
      <Input placeholder="Name" />
      <Textarea rows={3} placeholder="Bio" />

      {/* Checkbox / Radio render a <label> wrapper; the ref and input
          props (checked, onChange, name, value, disabled…) go to the input. */}
      <Checkbox defaultChecked>Enable sound</Checkbox>

      <Radio name="theme" value="dark" defaultChecked>Dark</Radio>
      <Radio name="theme" value="light">Light</Radio>

      <Button>Save</Button>
    </Fieldset>
  );
}
```

### Tabs (controlled or uncontrolled)

`Tabs` is keyed by a string `value`. Use `value` + `onValueChange` for a controlled component, or `defaultValue` (or nothing — the first `Tab` wins) for uncontrolled.

```tsx
import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@tsaito18/tuicss-react";

function Example() {
  const [tab, setTab] = useState("a");
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabList>
        <Tab value="a">First</Tab>
        <Tab value="b">Second</Tab>
      </TabList>
      <TabPanel value="a">First panel</TabPanel>
      <TabPanel value="b">Second panel</TabPanel>
    </Tabs>
  );
}
```

### Modal (controlled)

`Modal` is controlled via the required `open` prop and renders through a portal to `document.body`. It calls `onClose` on overlay click (`closeOnOverlapClick`, default `true`) and on Escape (`closeOnEsc`, default `true`). `ModalCloseButton` is a plain button — wire its `onClick` to your close handler.

```tsx
import { useState } from "react";
import { Modal, ModalCloseButton, Button } from "@tsaito18/tuicss-react";

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalCloseButton onClick={() => setOpen(false)}>x</ModalCloseButton>
        <p>Hello from a modal.</p>
      </Modal>
    </>
  );
}
```

### Sidenav (controlled)

`Sidenav` is controlled via the required `open` prop and an optional `position` (`"left"` default, or `"right"`). There is no `onClose` callback — toggle your own state, typically with a `SidenavButton`.

```tsx
import { useState } from "react";
import { Sidenav, SidenavButton, SidenavItem } from "@tsaito18/tuicss-react";

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Sidenav open={open}>
      <SidenavButton onClick={() => setOpen((v) => !v)}>≡ Menu</SidenavButton>
      <SidenavItem href="#home">Home</SidenavItem>
      <SidenavItem href="#about">About</SidenavItem>
    </Sidenav>
  );
}
```

### Datetime (live clock)

`Datetime` renders a self-updating clock. Supply a `format` string (default `"h:m:s a"`) and an optional `intervalMs` (default `1000`). It renders empty on the server and starts updating after mount (SSR-safe).

```tsx
import { Datetime } from "@tsaito18/tuicss-react";

<Datetime format="M/d/y H:m:s" />; // e.g. 06/25/2026 15:07:42
```

Format tokens (powered by the exported `formatDatetime(date, format)` helper):

| Token | Meaning                       | Example | Notes                                              |
| ----- | ----------------------------- | ------- | -------------------------------------------------- |
| `M`   | Month                         | `06`    | 2-digit, zero-padded (01–12)                       |
| `d`   | Day of month                  | `25`    | 2-digit, zero-padded (01–31)                       |
| `e`   | Day of week (numeric)         | `05`    | Sunday=`01` … Saturday=`07`                        |
| `y`   | Full year                     | `2026`  | 4-digit                                            |
| `H`   | Hour (24h)                    | `15`    | 2-digit, zero-padded (00–23)                       |
| `h`   | Hour (12h)                    | `3`     | Not padded; midnight/noon render `12`              |
| `m`   | Minutes                       | `07`    | 2-digit, zero-padded                               |
| `s`   | Seconds                       | `42`    | 2-digit, zero-padded                               |
| `a`   | Meridiem                      | `PM`    | `AM` / `PM`                                        |

Note: each token is replaced once, so use a token at most once per format string.

### Dropdown

`Dropdown` opens on hover/focus (pure CSS — no JS state). It renders an `<li>`, so place it inside a list or a `Navbar`. `label` is required.

```tsx
import { Navbar, NavbarItem, Dropdown, DropdownItem } from "@tsaito18/tuicss-react";

<Navbar>
  <NavbarItem href="#home">Home</NavbarItem>
  <Dropdown label="File">
    <DropdownItem href="#new">New</DropdownItem>
    <DropdownItem href="#open">Open</DropdownItem>
  </Dropdown>
</Navbar>;
```

### Layout: Screen, Panel, Window, Background

```tsx
import {
  Screen,
  Window,
  Panel,
  PanelHeader,
  PanelContent,
  Background,
} from "@tsaito18/tuicss-react";

<Background color="blue-white">
  <Screen size="800-600" bordered centered>
    <Panel>
      <PanelHeader>Status</PanelHeader>
      <PanelContent>All systems nominal.</PanelContent>
    </Panel>
  </Screen>
</Background>;
```

- `Screen` accepts `size` (`"640-480"`, `"800-600"` default, `"1024-768"`), `bordered`, and `centered`.
- `Background` requires a `color` (e.g. `"blue-white"`, `"green-black"`, …).

### Grid (12 columns)

`Col` takes responsive span props `s` / `m` / `l` (1–12) and offsets `offsetS` / `offsetM` / `offsetL`.

```tsx
import { Container, Row, Col } from "@tsaito18/tuicss-react";

<Container>
  <Row>
    <Col s={12} m={6}>Left</Col>
    <Col s={12} m={6}>Right</Col>
  </Row>
</Container>;
```

### Tables

`Table` is a styled `<table>`; the optional `hovered` / `striped` props take a color name (e.g. `"cyan"`). `TableGrid` renders the bordered grid variant.

```tsx
import { Table, TableGrid } from "@tsaito18/tuicss-react";

<Table striped="cyan">
  <thead>
    <tr><th>Name</th><th>Score</th></tr>
  </thead>
  <tbody>
    <tr><td>A</td><td>10</td></tr>
    <tr><td>B</td><td>20</td></tr>
  </tbody>
</Table>;
```

### ProgressBar

```tsx
import { ProgressBar } from "@tsaito18/tuicss-react";

<ProgressBar value={60} label />            {/* shows "60%" */}
<ProgressBar value={3} max={5} />
<ProgressBar indeterminate />
```

`value` (default `0`), `max` (default `100`), `indeterminate`, and `label` (`true` → `"{percent}%"`, or pass a custom node).

### Chart

Use the data-driven `ChartData` for the common case, or compose the low-level parts (`Chart`, `ChartDisplay`, `ChartValue`, `ChartXAxis`, `ChartYAxis`, `ChartLegend`) yourself. Bar `value` is a percentage 0–100; `color` is a color token (e.g. `"green-168"`).

```tsx
import { ChartData } from "@tsaito18/tuicss-react";

<ChartData
  data={[
    { value: 40, color: "green-168", label: "Q1" },
    { value: 75, color: "cyan-168", label: "Q2" },
    { value: 55, color: "yellow-168", label: "Q3" },
  ]}
  xAxis={["Q1", "Q2", "Q3"]}
/>;
```

### Other components

`Navbar` / `NavbarItem`, `StatusBar` / `StatusBarItem` / `StatusBarDivider`, `Shortcut`, and `Divider` (optional `color="black"`) round out the chrome of a classic TUI screen.

---

## Color system

TuiCss color class names follow a consistent pattern. The seven chromatic colors require an intensity suffix (`168` = soft / DOS-like, `255` = bright); `black`, `white`, and the semantic themes (`primary`, `secondary`, `success`, `danger`, `warning`, `info`) take no suffix.

```
{color}-{168|255}            background   →  blue-168
{color}-{168|255}-text       text color   →  blue-168-text
{color}-{168|255}-border     border color →  blue-168-border
…-hover                      hover variant →  blue-168-hover, blue-168-text-hover, …
```

You can write these classes by hand, or build them type-safely with the `tuiColor` / `tuiColorClasses` helpers:

```tsx
import { Button, tuiColor, tuiColorClasses } from "@tsaito18/tuicss-react";

// One slot at a time:
<Button className={tuiColor.bg("red-255")}>Danger</Button>;

// Several slots at once (output order is stable):
const cls = tuiColorClasses({
  bg: "blue-168",
  text: "white",
  border: "red-255",
  bgHover: "blue-255",
});
// → "blue-168 white-text red-255-border blue-255-hover"

<Button className={cls}>Styled</Button>;
```

Invalid tokens are rejected at the type level, so typos are caught at compile time.

## Utilities

Type-safe class-name builders for borders, shadows, and scrollbars:

```tsx
import { borderClass, shadowClass, scrollbarClass, ScrollArea } from "@tsaito18/tuicss-react";

borderClass("double");                          // "tui-border-double"

shadowClass();                                  // "tui-shadow"
shadowClass({ level: 3 });                      // "tui-shadow-3"
shadowClass({ direction: "left", level: 2 });   // "tui-shadow-left-2"
shadowClass({ none: true });                    // "tui-no-shadow"

scrollbarClass("green");                        // "tui-scroll-green"
```

`ScrollArea` is a scrollable container that applies a TuiCss scrollbar color (default cyan):

```tsx
<ScrollArea color="green" style={{ height: 120 }}>
  <p>Lots of content…</p>
</ScrollArea>
```

> **Chrome / WebKit only:** scrollbar coloring (`scrollbarClass` and `ScrollArea`'s `color`) is implemented via the `::-webkit-scrollbar` pseudo-element. In non-WebKit browsers (e.g. Firefox) scrolling still works, but the custom color is ignored.

## TypeScript

Type declarations are bundled (`dist/index.d.ts` for ESM, `dist/index.d.cts` for CJS) and resolved automatically — no `@types` package required. Every component's `Props` type is exported (e.g. `ButtonProps`, `TabsProps`, `ChartDataProps`), along with the color/utility types (`TuiColorToken`, `TuiColorInput`, `TuiBorderStyle`, `TuiShadowInput`, `TuiScrollbarColor`, …).

---

## License & Credits

This project is licensed under the [MIT License](./LICENSE), Copyright (c) 2026 Taiga Saito.

It builds upon and redistributes assets from:

- **[TuiCss](https://github.com/vinibiavatti1/TuiCss)** by Vinicius Reif Biavatti — MIT License, Copyright (c) 2019. The SCSS sources, fonts, and images are vendored under `vendor/tuicss/` and recompiled at publish time (see `vendor/tuicss/LICENSE` and `vendor/tuicss/NOTICE.md`).
- **"Perfect DOS VGA 437"** font, bundled via TuiCss and free to redistribute (see `vendor/tuicss/fonts/dos437.txt`).
