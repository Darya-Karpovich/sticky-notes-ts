import { MoveDiagonal } from "lucide-react";
import { memo } from "react";
import type { NoteData } from "../types";
import { useDrag } from "../hooks/useDrag";
import { useResize } from "../hooks/useResize";
import styles from "./Note.module.css";

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
        className={styles.note}
        onMouseDown={handleMouseDown}
        style={{
          left: dragPosition?.x ?? position.x,
          top: dragPosition?.y ?? position.y,
          width,
          height,
          zIndex,
          background: color,
        }}
      >
        <input
          type="color"
          className={styles.colorPicker}
          value={color}
          onChange={(e) => onColorChange(note.id, e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => onNoteChange(note.id, e.target.value)}
          placeholder="Type your note here..."
        />
        <MoveDiagonal
          size={20}
          className={styles.resizeHandle}
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    );
  },
);
