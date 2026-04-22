import { MoveDiagonal } from "lucide-react";
import { memo, useRef } from "react";
import type { NoteData } from "../types";
import styles from "./Note.module.css";

type NoteProps = {
  note: NoteData;
  onStartDrag: (note: NoteData, el: HTMLDivElement, e: React.MouseEvent) => void;
  onStartResize: (
    note: NoteData,
    el: HTMLDivElement,
    e: React.MouseEvent,
  ) => void;
  onUpdate: (id: string, patch: Partial<NoteData>) => void;
};

export const Note = memo(
  ({ note, onStartDrag, onStartResize, onUpdate }: NoteProps) => {
    const { id, content, position, width, height, color, zIndex } = note;
    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (elementRef.current) {
        onStartDrag(note, elementRef.current, e);
      }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (elementRef.current) {
        onStartResize(note, elementRef.current, e);
      }
    };

    return (
      <div
        ref={elementRef}
        className={styles.note}
        onMouseDown={handleMouseDown}
        style={{
          left: position.x,
          top: position.y,
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
          onChange={(e) => onUpdate(id, { color: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => onUpdate(id, { content: e.target.value })}
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
