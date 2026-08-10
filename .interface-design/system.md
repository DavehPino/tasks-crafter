# Session Prep Dashboard — Design System

## Intent

**Human:** Live commerce operator, 5 minutes before session broadcast. Stressed but competent.  
**Task:** Confirm product selection, verify all prep tasks complete, go live in 300 seconds.  
**Feel:** Dense like a control room, calm like a checklist. No distractions. Feedback is immediate.

---

## Direction: "Command Center Dashboard"

Taller de producción, not SaaS. Structure echoes live commerce environment: monitors, status badges, semaphore signals, urgency that's structured.

---

## Color Palette

From live commerce domain (stock monitors, broadcast floors, inventory screens):

- **Neutral Black** (`#1f2937`) — structure, grid lines, text
- **Clean White** (`#ffffff`) — content surfaces, clarity
- **Professional Blue** (`#0066cc`) — action, primary intent, control room feeling (saturated, not light)
- **Semaphore Green** (`#059669`) — ready, completed, go-live signal
- **Semaphore Red** (`#dc2626`) — error, blocking, stock critical
- **Semaphore Yellow** (`#f59e0b`) — attention, in-progress, review needed
- **Neutral Gray** (`#9ca3af`) — secondary, metadata, disabled

**Principle:** 60% white/gray (structure) · 30% gray tones (hierarchy) · 10% signal colors (semantic).

---

## Depth Strategy

**Borders only.** No shadows. Clarity over dimensional. Borders define structure quietly.

- **Standard border:** `rgba(0,0,0,0.06)` 1px
- **Emphasis border:** `rgba(0,0,0,0.12)` 1px
- **Focus ring:** `#0066cc` 2px solid

---

## Spacing & Density

**Base unit:** 8px  
**Density:** Compact, control-room-tight. 12–16px padding in cards, 4–8px gaps.

| Context | Padding | Gap |
|---------|---------|-----|
| Card interior | 12–16px | — |
| Section spacing | — | 24–32px |
| Inline elements | — | 8px |
| Icon + text | — | 4px |

---

## Typography

**Typeface:** System default (inherit Tailwind's sans)  
**Scale ratio:** 1.2 (dense, minor third)  
**Base:** 14px

| Level | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Body | 14px | 400 | primary | Default text |
| Label | 14px | 500 | secondary | Field labels, metadata |
| Caption | 11px | 500 | muted | Timestamps, disabled |
| H4 | 16px | 600 | primary | Section heads |
| H3 | 18px | 600 | primary | Card titles |
| H2 | 22px | 600 | primary | Major headers |
| H1 | 28px | 700 | primary | Page title |
| Metric | 28px | 600 | primary | Large numbers (tabular-nums) |

**Hierarchy:** Weight + color do more work than size. Three tiers: 600 primary (hero) · 500 secondary (supporting) · 400/muted (metadata).

---

## Signature Element: "Status Timeline"

Horizontal timeline of products in session order. Each item:

- Product name (truncated)
- Status badge: ⬜ Pending · 🟡 In Progress · 🟢 Ready
- Task count: `2/3` (completado/total)
- On hover: Expands to show task list inline

**Why:** Communicates 5 data points in 2cm². Echoes production floor workflow. Fits on one screen. Status-first, details-on-demand.

---

## Component Patterns

### Session Metrics Card
- Container: 16px padding, `bg-white` border
- Label: 11px/500/muted, tracked (letter-spacing: 0.05em)
- Value: 28px/600/primary, tabular-nums
- Tertiary: 12px/500/success, delta or trend

Example: `PRODUCTS READY` · `5 of 15` · `↑ auto-generated 12 tasks`

### Product Card (Selector)
- 280px width, 1:1 aspect cover image
- Title: 14px/600, line-clamp-2
- Meta: 12px/500/secondary, grid: `price · rating · category`
- Checkbox: top-right, 44×44px hit area
- Border: 1px `rgba(0,0,0,0.06)`, hover → 2px
- Padding: 12px

### Task Row
- Checkbox · Product name · Task title · Status badge · Complete button
- Height: 44px (WCAG minimum hit area)
- Padding: 12px
- Border-bottom: 1px `rgba(0,0,0,0.06)`
- Completed: `strikethrough · opacity-50 · text-muted`

### Status Badge
- Inline-block, 12px padding, 4px radius (small), 11px/500 text
- States: pending (gray) · in-progress (yellow) · ready (green)

---

## States & Interactions

**Every interactive element:**
- Default (as described)
- Hover: `opacity-75` or border → emphasis-border
- Focus: `focus:ring-2 ring-primary`
- Active: `transform: scale(0.97)`
- Disabled: `opacity-50 cursor-not-allowed`

**Buttons:**
- Primary: `bg-blue-600 text-white`, 36px h, 16px pad, 4px radius
- Secondary: `bg-gray-100 text-gray-900`, same dims
- Destructive: `bg-red-600 text-white`
- Press: `active:scale-0.97`
- Motion: 120ms `ease-out`

**Motion:**
- Button press: 100ms
- Status change: 200ms fade
- Timeline expand: 150ms

---

## Checks

- **Swap test:** Swap blue for default gray, borders for shadows → loses "control room" feeling. ✓
- **Squint test:** Hierarchy clear (h1 > metrics > rows). No harsh borders. ✓
- **Signature test:** Timeline, semaphore colors, compact density, all three appear throughout. ✓
- **Token test:** `semaphore-green`, `control-border`, `metric-value` — belong to this domain. ✓

