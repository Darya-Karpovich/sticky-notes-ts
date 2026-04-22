import { useCallback } from "react";
import type { NoteData } from "../types";

const DRAG_THRESHOLD = 5;
const MIN_NOTE_SIZE = 100;

const isInside = (rect: DOMRect, x: number, y: number) =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

type Params = {
  trashRef: React.RefObject<HTMLDivElement | null>;
  bringToFront: (id: string) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updatedFields: Partial<NoteData>) => void;
};

export const useNoteInteractions = ({
  trashRef,
  bringToFront,
  removeNote,
  updateNote,
}: Params) => {
  const startDrag = useCallback(
    (note: NoteData, el: HTMLDivElement, e: React.MouseEvent) => {
      bringToFront(note.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const offsetX = startX - note.position.x;
      const offsetY = startY - note.position.y;
      const maxX = window.innerWidth - note.width;
      const maxY = window.innerHeight - note.height;
      let lastX = note.position.x;
      let lastY = note.position.y;
      let dragging = false;

      const mouseMove = (ev: MouseEvent) => {
        if (!dragging) {
          if (
            Math.abs(ev.clientX - startX) < DRAG_THRESHOLD &&
            Math.abs(ev.clientY - startY) < DRAG_THRESHOLD
          ) {
            return;
          }
          dragging = true;
        }
        lastX = Math.max(0, Math.min(ev.clientX - offsetX, maxX));
        lastY = Math.max(0, Math.min(ev.clientY - offsetY, maxY));
        el.style.left = `${lastX}px`;
        el.style.top = `${lastY}px`;
      };

      const mouseUp = (ev: MouseEvent) => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        if (!dragging) return;
        const trashZone = trashRef.current?.getBoundingClientRect();
        if (trashZone && isInside(trashZone, ev.clientX, ev.clientY)) {
          removeNote(note.id);
        } else {
          updateNote(note.id, { position: { x: lastX, y: lastY } });
        }
      };

      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    },
    [bringToFront, removeNote, trashRef, updateNote],
  );

  const startResize = useCallback(
    (note: NoteData, el: HTMLDivElement, e: React.MouseEvent) => {
      bringToFront(note.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = note.width;
      const startHeight = note.height;
      const maxWidth = window.innerWidth - note.position.x;
      const maxHeight = window.innerHeight - note.position.y;
      let lastWidth = startWidth;
      let lastHeight = startHeight;

      const mouseMove = (ev: MouseEvent) => {
        lastWidth = Math.min(
          maxWidth,
          Math.max(MIN_NOTE_SIZE, startWidth + ev.clientX - startX),
        );
        lastHeight = Math.min(
          maxHeight,
          Math.max(MIN_NOTE_SIZE, startHeight + ev.clientY - startY),
        );
        el.style.width = `${lastWidth}px`;
        el.style.height = `${lastHeight}px`;
      };

      const mouseUp = () => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        if (lastWidth !== startWidth || lastHeight !== startHeight) {
          updateNote(note.id, { width: lastWidth, height: lastHeight });
        }
      };

      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    },
    [bringToFront, updateNote],
  );

  return { startDrag, startResize };
};
