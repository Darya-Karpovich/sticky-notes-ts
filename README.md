# Sticky Notes

Single-page web application for sticky notes

## Getting started

```bash
pnpm install
pnpm dev
```

## Architecture

- `Board` - main component, manages notes state and interactions
- `Note` - represents a single sticky note, handles its own rendering and interactions
- `useNotes` - custom hook for managing notes state and persistence
- `useResize` - custom hook for handling note resizing logic
- `useDrag` - custom hook for handling note dragging logic

Core state managed in custom hook `useNotes`, persisted to `localStorage` with debounce to optimize performance on note editing. Notes can be created, moved, edited, resized and deleted via dragging to "trash area" in top right corner of the board. Each note hase a color picker for customizing its background color. Note can be created by dragging on empty board area and should have min size 100px to be added to the board. Also note can be added by button click, in this case it will be added with default size and position.
## Implemented features

Required:
1. Create a new note of the specified size at the specified position. (firstly implemented via button click, then added creation by drawing note sketch)
2. Change note size by dragging.
3. Move a note by dragging.
4. Remove a note by dragging it over a predefined "trash" zone.

Extra:
- Entering/editing note text.
- Moving notes to front (in case of overlapping notes).
- Saving notes to local storage (restoring them on page load).
- Different note colors.
