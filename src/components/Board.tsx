import { Shredder } from "lucide-react";
import { useRef } from "react";
import { useNotes } from "../hooks/useNotes";
import { useNoteInteractions } from "../hooks/useNoteInteractions";
import { useDrawNewNote } from "../hooks/useDrawNewNote";
import { Note } from "./Note";
import styles from "./Board.module.css";

const DEFAULT_COLOR = "#ffdb38";

export const Board = () => {
  const trashRef = useRef<HTMLDivElement>(null);

  const { notes, addNote, updateNote, bringToFront, removeNote } = useNotes();
  const { startDrag, startResize } = useNoteInteractions({
    trashRef,
    bringToFront,
    removeNote,
    updateNote,
  });

  const { draftRef, handleMouseDown } = useDrawNewNote(addNote, DEFAULT_COLOR);

  const handleAdd = () => {
    addNote({
      content: "",
      position: { x: 100, y: 100 },
      width: 200,
      height: 200,
      color: DEFAULT_COLOR,
    });
  };

  return (
    <div className={styles.board} onMouseDown={handleMouseDown}>
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
      <div
        ref={draftRef}
        className={styles.draftPreview}
        style={{ display: "none" }}
      />
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onStartDrag={startDrag}
          onStartResize={startResize}
          onUpdate={updateNote}
        />
      ))}
    </div>
  );
};
