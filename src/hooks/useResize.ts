import { useState } from "react";
import type { NoteData } from "../types";

const MIN_SIZE = 100;

export const useResize = (
  note: NoteData,
  onResize: (id: string, width: number, height: number) => void,
) => {
  const [resizeSize, setResizeSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = resizeSize?.width ?? note.width;
    const startHeight = resizeSize?.height ?? note.height;

    const maxWidth = window.innerWidth - note.position.x;
    const maxHeight = window.innerHeight - note.position.y;

    let lastWidth = startWidth;
    let lastHeight = startHeight;

    const mouseMove = (ev: MouseEvent) => {
      lastWidth = Math.min(
        maxWidth,
        Math.max(MIN_SIZE, startWidth + ev.clientX - startX),
      );
      lastHeight = Math.min(
        maxHeight,
        Math.max(MIN_SIZE, startHeight + ev.clientY - startY),
      );
      setResizeSize({ width: lastWidth, height: lastHeight });
    };

    const mouseUp = () => {
      if (lastWidth !== startWidth || lastHeight !== startHeight) {
        onResize(note.id, lastWidth, lastHeight);
      }
      setResizeSize(null);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  return { handleMouseDown, resizeSize };
};
