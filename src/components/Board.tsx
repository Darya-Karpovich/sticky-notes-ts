import { Shredder } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useNotes } from "../hooks/useNotes";
import type { NoteData } from "../types";
import { Note } from "./Note";
import styles from "./Board.module.css";

const MIN_DRAFT_SIZE = 100;
const DEFAULT_COLOR = "#ffdb38";

export const Board = () => {
  const { notes, addNote, updateNote, bringToFront, removeNote } = useNotes();
  const trashRef = useRef<HTMLDivElement>(null);
  const [newNote, setNewNote] = useState<Omit<
    NoteData,
    "id" | "zIndex"
  > | null>(null);

  const handleAdd = () => {
    addNote({
      content: "",
      position: { x: 100, y: 100 },
      width: 200,
      height: 200,
      color: DEFAULT_COLOR,
    });
  };

  const handleMove = useCallback(
    (id: string, x: number, y: number) =>
      updateNote(id, { position: { x, y } }),
    [updateNote],
  );
  const handleResize = useCallback(
    (id: string, width: number, height: number) =>
      updateNote(id, { width, height }),
    [updateNote],
  );
  const handleContentChange = useCallback(
    (id: string, content: string) => updateNote(id, { content }),
    [updateNote],
  );
  const handleColorChange = useCallback(
    (id: string, color: string) => updateNote(id, { color }),
    [updateNote],
  );

  const handleDrawNewNote = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    const startX = e.clientX;
    const startY = e.clientY;
    let lastWidth = 0;
    let lastHeight = 0;

    const newNote = {
      content: "",
      position: { x: startX, y: startY },
      color: DEFAULT_COLOR,
    };

    const mouseMove = (ev: MouseEvent) => {
      lastWidth = Math.max(0, ev.clientX - startX);
      lastHeight = Math.max(0, ev.clientY - startY);
      setNewNote({ ...newNote, width: lastWidth, height: lastHeight });
    };
    const mouseUp = () => {
      if (lastHeight > MIN_DRAFT_SIZE && lastWidth > MIN_DRAFT_SIZE) {
        addNote({
          ...newNote,
          width: lastWidth,
          height: lastHeight,
        });
      }
      setNewNote(null);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  return (
    <div className={styles.board} onMouseDown={handleDrawNewNote}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sticky Notes Board</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          + Add note
        </button>
      </div>
      <div ref={trashRef} className={styles.trashZone}>
        <Shredder size={32} />
        <span>drag here to remove note</span>
      </div>
      {newNote && (
        <div
          className={styles.draftPreview}
          style={{
            left: newNote.position.x,
            top: newNote.position.y,
            width: newNote.width,
            height: newNote.height,
          }}
        />
      )}
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onMove={handleMove}
          onResize={handleResize}
          onNoteChange={handleContentChange}
          onBringToFront={bringToFront}
          onRemove={removeNote}
          onColorChange={handleColorChange}
          trashRef={trashRef}
        />
      ))}
    </div>
  );
};
