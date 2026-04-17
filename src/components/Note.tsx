import { MoveDiagonal } from "lucide-react";
import type { NoteData } from "../types";
import { memo } from "react";
import { useDrag } from "../hooks/useDrag";
import { useResize } from "../hooks/useResize";

type NoteProps = {
  note: NoteData;
  onNoteChange: (id: string, content: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onBringToFront: (id: string) => void;
  onRemove: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  trashRef: React.RefObject<HTMLDivElement | null>;
};

export const Note = memo(
  ({
    note,
    onNoteChange,
    onResize,
    onMove,
    onBringToFront,
    onRemove,
    onColorChange,
    trashRef,
  }: NoteProps) => {
    const { content, position, color, zIndex } = note;

    const { handleMouseDown: startDrag, dragPosition } = useDrag(
      note,
      onMove,
      onRemove,
      trashRef,
    );
    const { handleMouseDown: startResize, resizeSize } = useResize(
      note,
      onResize,
    );

    const width = resizeSize?.width ?? note.width;
    const height = resizeSize?.height ?? note.height;

    const handleMouseDown = (e: React.MouseEvent) => {
      onBringToFront(note.id);
      startDrag(e);
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onBringToFront(note.id);
      startResize(e);
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
        <input
          type="color"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: 0,
          }}
          value={color}
          onChange={(e) => onColorChange(note.id, e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        />
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
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    );
  },
);
