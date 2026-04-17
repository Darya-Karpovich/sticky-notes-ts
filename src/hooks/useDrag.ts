import { useState } from "react";
import type { NoteData } from "../types";

const DRAG_THRESHOLD = 5;

const isInside = (rect: DOMRect, x: number, y: number) =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

export const useDrag = (
  note: NoteData,
  onMove: (id: string, x: number, y: number) => void,
  onRemove: (id: string) => void,
  trashRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - note.position.x;
    const offsetY = startY - note.position.y;
    let lastX = note.position.x;
    let lastY = note.position.y;
    let dragging = false;

    const mouseMove = (ev: MouseEvent) => {
      if (!dragging) {
        if (
          Math.abs(ev.clientX - startX) < DRAG_THRESHOLD &&
          Math.abs(ev.clientY - startY) < DRAG_THRESHOLD
        )
          return;
        dragging = true;
      }

      const maxX = window.innerWidth - note.width;
      const maxY = window.innerHeight - note.height;
      lastX = Math.max(0, Math.min(ev.clientX - offsetX, maxX));
      lastY = Math.max(0, Math.min(ev.clientY - offsetY, maxY));
      setDragPosition({ x: lastX, y: lastY });
    };

    const mouseUp = (ev: MouseEvent) => {
      if (dragging) {
        const trashZone = trashRef.current?.getBoundingClientRect();
        if (trashZone && isInside(trashZone, ev.clientX, ev.clientY)) {
          onRemove(note.id);
        } else {
          onMove(note.id, lastX, lastY);
        }
      }
      setDragPosition(null);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  return { handleMouseDown, dragPosition };
};
