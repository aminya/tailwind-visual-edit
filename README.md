# Tailwind Visual Edit

> Stop guessing what your Tailwind classes do. See them at a glance.

**Tailwind Visual Edit** colorizes your Tailwind classes directly in the editor, grouped by category, and gives you a visual sidebar panel to edit them without touching the code.

---

## Features

**Color-coded classes** -- Each Tailwind utility in your `className` gets a distinct color based on its category: layout in orange, spacing in blue, typography in purple, and more. No more walls of white text.

**Visual editing panel** -- Open the sidebar, click on an element, and tweak spacing, typography, colors, and effects with intuitive controls. Changes are synced back to your code instantly.

**Hover info** -- Hover any class to see its category at a glance.

## How it works

1. Open any file with Tailwind classes (`.tsx`, `.jsx`, `.html`, `.vue`, `.svelte`, `.astro`, `.php`)
2. Classes are automatically colored by category
3. Click the **Tailwind Visual Edit** icon in the activity bar to open the visual editor
4. Place your cursor inside an element to edit its classes visually

## Category colors

| Color   | Category       | Examples                             |
|---------|----------------|--------------------------------------|
| Orange  | Layout         | `flex`, `grid`, `block`, `hidden`    |
| Blue    | Spacing        | `p-4`, `mt-2`, `gap-3`, `space-x-2` |
| Cyan    | Sizing         | `w-full`, `h-screen`, `max-w-lg`    |
| Purple  | Typography     | `text-lg`, `font-bold`, `leading-6` |
| Green   | Colors         | `bg-blue-500`, `text-white`         |
| Yellow  | Borders        | `border`, `rounded-lg`, `ring-2`    |
| Pink    | Effects        | `shadow-md`, `opacity-50`, `blur`   |
| Gray    | Interactivity  | `cursor-pointer`, `select-none`     |

## Commands

- **Tailwind Visual Edit: Toggle Class Highlighting** -- Enable/disable class coloring

## Installation

Install from VSIX: **Extensions** > **...** > **Install from VSIX...**

---

MIT License
