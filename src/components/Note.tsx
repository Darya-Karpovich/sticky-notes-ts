import { MoveDiagonal } from "lucide-react";
import type { NoteData } from "../types";
import { useState } from "react";

type NoteProps = {
  note: NoteData;
  onNoteChange: (id: string, content: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onBringToFront: (id: string) => void;
};

export const Note = ({
  note,
  onNoteChange,
  onResize,
  onMove,
  onBringToFront,
}: NoteProps) => {
  const { content, position, color, zIndex } = note;
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [resizeSize, setResizeSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const width = resizeSize?.width ?? note.width;
  const height = resizeSize?.height ?? note.height;

  const handleMouseDown = (e: React.MouseEvent) => {
    onBringToFront(note.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - position.x;
    const offsetY = startY - position.y;
    let lastX = position.x;
    let lastY = position.y;
    let dragging = false;

    const mouseMove = (ev: MouseEvent) => {
      if (!dragging) {
        if (
          Math.abs(ev.clientX - startX) < 5 &&
          Math.abs(ev.clientY - startY) < 5
        )
          return;
        dragging = true;
      }

      const maxLastX = window.innerWidth - width;
      const maxLastY = window.innerHeight - height;
      lastX = Math.max(0, Math.min(ev.clientX - offsetX, maxLastX));
      lastY = Math.max(0, Math.min(ev.clientY - offsetY, maxLastY));

      setDragPosition({ x: lastX, y: lastY });
    };
    const mouseUp = () => {
      if (dragging) {
        onMove(note.id, lastX, lastY);
      }
      setDragPosition(null);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const maxWidth = window.innerWidth - position.x;
    const maxHeight = window.innerHeight - position.y;

    let lastWidth = startWidth;
    let lastHeight = startHeight;

    const mouseMove = (ev: MouseEvent) => {
      lastWidth = Math.min(
        maxWidth,
        Math.max(100, startWidth + ev.clientX - startX),
      );
      lastHeight = Math.min(
        maxHeight,
        Math.max(100, startHeight + ev.clientY - startY),
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

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: dragPosition?.x ?? position.x,
        top: dragPosition?.y ?? position.y,
        height,
        width,
        zIndex,
        background: color,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        pointerEvents: "auto",
      }}
    >
      <textarea
        style={{
          height,
          width,
          border: "none",
          outline: "none",
          background: "transparent",
          padding: 20,
          paddingTop: 30,
          boxSizing: "border-box",
          resize: "none",
          cursor: "pointer",
        }}
        value={content}
        onChange={(e) => onNoteChange(note.id, e.target.value)}
        placeholder="Type your note here..."
      />
      <MoveDiagonal
        size={20}
        style={{
          cursor: "se-resize",
          position: "absolute",
          bottom: 5,
          right: 5,
        }}
        onMouseDown={onResizeMouseDown}
      />
    </div>
  );
};
