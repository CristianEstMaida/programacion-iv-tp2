---
name: Kinetic Executive Network
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#454652'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c5c5d4'
  surface-tint: '#4355b9'
  primary: '#24389c'
  on-primary: '#ffffff'
  primary-container: '#3f51b5'
  on-primary-container: '#cacfff'
  inverse-primary: '#bac3ff'
  secondary: '#4755b6'
  on-secondary: '#ffffff'
  secondary-container: '#8a99fe'
  on-secondary-container: '#1b2b8c'
  tertiary: '#3f434c'
  on-tertiary: '#ffffff'
  tertiary-container: '#575a64'
  on-tertiary-container: '#cfd2dd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00105c'
  on-primary-fixed-variant: '#293ca0'
  secondary-fixed: '#dfe0ff'
  secondary-fixed-dim: '#bbc3ff'
  on-secondary-fixed: '#000d5f'
  on-secondary-fixed-variant: '#2d3c9c'
  tertiary-fixed: '#e0e2ee'
  tertiary-fixed-dim: '#c4c6d2'
  on-tertiary-fixed: '#181b24'
  on-tertiary-fixed-variant: '#434750'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a high-trust, editorial-grade digital workspace engineered for verified professionals, executives, and high-growth operators. The aesthetic balances the rigor of an enterprise analytics suite with the ambient warmth and fluidity of a premium social platform.

### Design Principles
- **Clarity Over Clutter:** Interface elements exist solely to amplify user content, professional achievements, and data insights. Visual noise is actively suppressed.
- **Structured Precision:** Spatial layout follows an exacting modular rhythm, providing immediate familiarity while supporting dense networks and asynchronous communications.
- **Architectural Depth:** Elevation is achieved through soft luminosity and micro-borders rather than opaque, aggressive drop shadows.
- **Effortless Authority:** The balance of high-contrast typography, deep indigo accents, and generous breathing room commands focus without visual fatigue.

## Colors
The palette leverages a classic, verified indigo foundation to build authority, paired with clinical neutrals to maximize content legibility.

### Palette Architecture
- **Primary Indigo (`#3F51B5`):** Reserved for primary interactive elements, active states, key focus rings, and high-visibility engagement triggers.
- **Dark Indigo Accent (`#303F9F`):** Applied to active states, pressed button feedback, and high-emphasis navigational anchors.
- **Light Indigo Tint (`#E8EAF6`):** Used strictly for subtle interactive highlights, pill badge backgrounds, metric tags, and active tab highlights.
- **Surface Canvas (`#F7F8FA`):** The foundational backdrop across all viewports, providing soft contrast against pure white cards.
- **Surface Elevation (`#FFFFFF`):** Applied exclusively to cards, modal layers, popovers, and sticky navigation headers.
- **Structural Outlines (`#E5E7EB` / `#F0F2F5`):** Subdued borders defining container geometry without segmenting the UI aggressively.
- **Typography Neutrals:** Slate-900 (`#0F172A`) for primary headlines, Slate-600 (`#475569`) for readable longform body, and Slate-400 (`#94A3B8`) for secondary metadata and linear icon outlines.

## Typography
Typography is set entirely in **Inter** to ensure maximum digital clarity, optical legibility at micro sizes, and systematic scale across responsive layouts.

### Hierarchy & Usage
- **Display & Headlines:** Ranging from `headline-xl` down to `headline-sm`, headings employ tight negative tracking (`-0.01em` to `-0.025em`) paired with `600` or `700` weights to produce an authoritative, crisp editorial voice.
- **Body:** Standard text runs between `13px` (`body-sm`) and `16px` (`body-lg`) using generous line heights (`1.5` to `1.625`) to optimize readability across multi-paragraph posts and threaded professional debates.
- **Labels & Microcopy:** Badges, navigation links, and input descriptors use `500` and `600` weights with slightly positive tracking to maintain absolute legibility in compact footprints.

## Layout & Spacing
The layout follows an adaptive 12-column grid anchored by an 8pt spatial cadence.

### Grid & Breakpoints
- **Desktop (1280px+):** 12-column layout with max-width constrained to `1280px` or `1440px`. Features a 3-column architectural pattern: Persistent Global Nav / Left Rail (`260px`), Dynamic Feed / Main Stream (`640px` to `720px`), and Auxiliary Context / Metrics Rail (`320px`). Gutters remain fixed at `1.5rem` (`24px`).
- **Tablet (768px - 1023px):** 8-column layout. The secondary rail transitions into contextual bottom sheets or collapsible sidebars. Outer margin sets to `1.5rem` (`24px`).
- **Mobile (< 768px):** 4-column layout with `1rem` (`16px`) gutters and outer margins. The desktop left rail transforms into a persistent glass bottom bar.

## Elevation & Depth
Elevation in the design system uses structural, low-opacity layered ambient shadows paired with razor-thin boundary borders (`1px solid #E5E7EB` or `#F0F2F5`).

### Elevation Levels
- **Base Level (Canvas):** Flat `#F7F8FA`. No elevation.
- **Level 1 (Cards & Feed Modules):** `#FFFFFF` surface accompanied by a 1px border (`#F0F2F5`) and `shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hover States, Interactive Cards, Floating Menus):** Transition target for interactive cards and floating action modules. Border shifts to `#E5E7EB`, paired with `shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Overlays, Command Palettes):** `#FFFFFF` surface, `shadow-xl`: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`, suspended over a translucent `#0F172A` backdrop blur (`4px` blur, `30%` opacity).

## Shapes
The design system enforces a balanced curvature schema (`roundedness: 2`), utilizing `0.5rem` (`8px`) as standard roundness, while leveraging larger curvatures (`rounded-xl` / `0.75rem` - `1rem` and `rounded-2xl` / `1rem` - `1.25rem`) for macro-surfaces.

### Spatial Shape Rules
- **Micro UI (Badges, Chips, Pills):** Fully pill-shaped (`rounded-full` / `9999px`) to create distinction against rectilinear containers.
- **Interactive Form Elements & Buttons:** Standard `rounded-lg` (`0.5rem` / `8px`) to `rounded-xl` (`0.75rem` / `12px`) for comfortable visual ergonomics.
- **Cards, Containers, & Viewports:** `rounded-xl` (`16px`) and `rounded-2xl` (`20px`) for social post frames, metric dashboards, and modal envelopes.
- **Avatars:** Strictly circular (`rounded-full`) for individual profiles; squircle (`rounded-lg`) for corporate or verified team identifiers.

## Components

### Buttons
- **Primary:** Background `#3F51B5`, text `#FFFFFF`, font `label-lg`. Padding: `0.625rem 1.25rem`. Roundedness: `rounded-xl`. Transitions on hover to `#303F9F` with subtle scale transformation (`transform: translateY(-1px)`). Focus visible: 2px ring offset, 2px ring `#3F51B5`.
- **Secondary:** Background `#F7F8FA`, border `1px solid #E5E7EB`, text `#475569`. Hover triggers transition to background `#FFFFFF`, border `#CBD5E1`, and text `#0F172A`.
- **Ghost / Tertiary:** Background transparent, text `#3F51B5`. Hover brings a soft wash of `#E8EAF6`.

### Inputs & Form Fields
- Surface: `#FFFFFF`. Border: `1px solid #E5E7EB`. Roundedness: `rounded-xl`. Padding: `0.75rem 1rem`. Typography: `body-md`.
- **Focus State:** Border shifts cleanly to `#3F51B5`, supported by an exterior focus shadow ring: `0 0 0 3px rgba(63, 81, 181, 0.15)`. No jarring default browser outlines.
- **Prefix / Suffix Icons:** Centered 20px minimal linear icons in `#94A3B8`, shifting to `#3F51B5` on active input focus.

### Metric Cards & Feed Containers
- Surface: `#FFFFFF` encased in `1px solid #F0F2F5`. Roundedness: `rounded-2xl`. Spacing: `1.5rem` inner padding.
- **Metric Badges:** Pill-shaped tags (`rounded-full`) using `#E8EAF6` surface with `#303F9F` text, holding status indicators or percentage performance deltas.
- **Card Header:** Strict visual separation with a circular avatar (`48px` or `40px`), author title hierarchy, and inline timestamp tracking.

### Tab Navigation
- Horizontal arrangement with bottom active indicator.
- Text: `label-lg`, resting at `#64748B`. Hover shifts to `#0F172A`.
- Active state: `#3F51B5` text with a dedicated `2.5px` high indigo bar anchored to the bottom edge, animated smoothly with CSS transform/width properties.

### Chips & Pill Badges
- Height: `24px` to `28px`. Padding: `0 0.75rem`. Roundedness: `9999px`.
- Visual syntax: Flat background `#E8EAF6`, text `#303F9F`, font `label-sm`. Optional trailing remove icon (14px).

### Checkboxes & Radio Controls
- Base: `18px x 18px` geometric boundaries. Border `1.5px solid #CBD5E1`, background `#FFFFFF`.
- Checked: Background snaps to `#3F51B5` with a pure white check vector or radio center dot.
- Motion: `cubic-bezier(0.4, 0, 0.2, 1)` scaling transition on check state changes.