import { useRef } from "react";
import type { NoteData } from "../types";

const MIN_DRAFT_SIZE = 100;

export const useDrawNewNote = (
  addNote: (note: Omit<NoteData, "id" | "zIndex">) => void,
  defaultColor: string,
) => {
  const draftRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    const el = draftRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    let lastWidth = 0;
    let lastHeight = 0;

    if (el) {
      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.display = "block";
    }

    const mouseMove = (ev: MouseEvent) => {
      lastWidth = Math.max(0, ev.clientX - startX);
      lastHeight = Math.max(0, ev.clientY - startY);
      if (el) {
        el.style.width = `${lastWidth}px`;
        el.style.height = `${lastHeight}px`;
      }
    };

    const mouseUp = () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
      if (el) el.style.display = "none";
      if (lastWidth > MIN_DRAFT_SIZE && lastHeight > MIN_DRAFT_SIZE) {
        addNote({
          content: "",
          position: { x: startX, y: startY },
          color: defaultColor,
          width: lastWidth,
          height: lastHeight,
        });
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  return { draftRef, handleMouseDown };
};
