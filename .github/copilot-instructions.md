# Global page-design and component-reuse rule

Before finalizing the design of any page, or proposing or implementing a new component, first read this repository-wide rule and the applicable sections of `GRAMMAR_QUEST_UX_DESIGN_SYSTEM.md`.

- Search the existing component inventory and design patterns before designing or coding.
- Reuse an existing component or pattern whenever it can meet the requirement. Extend it if needed; do not recreate or duplicate an available component.
- Create a new component only when no existing component or pattern is suitable without compromising its intended behavior. Record the reason and update the design-system documentation when the design or reusable pattern changes.
- Apply this rule to every page and component across the application, not only the current feature.

---

# Lesson page pagination rule

Any lesson/content page that is taller than the visible content area must be split into sub-pages. Do not ship a long single scroll.

## When to split

- Visible content area is the space between the step progress row and the bottom Back/Next bar.
- If total content height is less than or equal to 1.25 times the visible height, keep one page and hide pager UI.
- Otherwise, paginate.

## How to split

- Pack blocks (cards, sections, accordions) in their original order.
- Fill each sub-page up to 90% of the visible height, then start a new one.
- Never split a block across pages. A block taller than a full page gets its own page and may scroll inside it.
- A heading or label stays with the block that follows it (`keepWithNext`).
- Authors may force a split with `pageBreakBefore`.
- If the last sub-page is under 25% full, merge it into the previous one.
- Never remove, shorten, reword, or reorder content to make it fit.

## Navigation

- Reuse the existing bottom Next button for sub-pages. Label it "Next page" before the last sub-page and "Next step" on the last sub-page.
- On the last sub-page, Next moves to the next lesson step at page 1.
- Reuse the existing bottom Back button for sub-pages. On page 1, it moves to the previous step's last sub-page.
- Do not add extra Next or Previous page buttons inside content.
- Under the step progress row, show `Page N of M · <page name>` and M dots (current is wide and dark, visited is green, unvisited is hollow). Hide it when a step has one page.
- Do not change the header, Learn/Guided/Practice tabs, step progress bar, scroll bar/scroll button, or Back/Pause/Reset/Next bar styling.

## Behaviour and accessibility

- Keep interactive state (taps, selected tabs, open accordions) when switching sub-pages by keeping pages mounted or lifting state.
- Reset scroll to top on every sub-page change.
- Do not re-paginate when an accordion opens or closes. Re-paginate only on resize, rotation, font-scale change, or when step content changes.
- Mark a step complete only when its last sub-page has been reached.
- Announce "Page N of M" to screen readers, move focus to the page's first heading, and keep touch targets at least 44px.

## Content design

Hint or comparison panels must not reuse the style of selectable option cards (coloured label pills, same card shape), because children may read them as extra options. Use a distinct clue/check panel with a dashed border, icon, short checklist, and one-line verdict.

## Configuration

Keep these values together in one configuration file:

```ts
PAGINATE_THRESHOLD = 1.25;
PAGE_FILL = 0.9;
MIN_LAST_PAGE_FILL = 0.25;
```
