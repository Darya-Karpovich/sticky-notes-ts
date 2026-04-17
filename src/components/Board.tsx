import { Shredder } from "lucide-react";
import { useNotes } from "../hooks/useNotes";
import { Note } from "./Note";
import { useCallback, useRef, useState } from "react";
import type { NoteData } from "../types";

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
      color: "#ffdb38",
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
    if (e.target === e.currentTarget) {
      const startX = e.clientX;
      const startY = e.clientY;
      let lastHeight = 0;
      let lastWidth = 0;

      const newNote = {
        content: "",
        position: { x: startX, y: startY },
        color: "#ffdb38",
      };

      const mouseMove = (ev: MouseEvent) => {
        lastWidth = Math.max(0, ev.clientX - startX);
        lastHeight = Math.max(0, ev.clientY - startY);
        setNewNote({ ...newNote, width: lastWidth, height: lastHeight });
      };
      const mouseUp = () => {
        if (lastHeight > 100 && lastWidth > 100) {
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
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "gray",
      }}
      onMouseDown={handleDrawNewNote}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <h1 style={{ fontWeight: 700 }}>Sticky Notes Board</h1>
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Add note
        </button>
      </div>
      <div
        ref={trashRef}
        style={{
          position: "absolute",
          zIndex: 1,
          borderColor: "tomato",
          borderStyle: "dashed",
          borderWidth: 2,
          borderRadius: 6,
          right: 0,
          top: 0,
          width: 200,
          height: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 16,
          boxSizing: "border-box",
          color: "tomato",
          fontWeight: 500,
          textAlign: "center",
          backgroundColor: "rgba(47, 44, 43, 0.45)",
        }}
      >
        <Shredder size={32} />
        <span>drag here to remove note</span>
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: newNote ? newNote.position.x : 0,
          top: newNote ? newNote.position.y : 0,
          width: newNote ? newNote.width : 0,
          height: newNote ? newNote.height : 0,
          backgroundColor: "rgba(214, 194, 102, 0.5)",
          border: "2px dashed #ffdb38",
          pointerEvents: "none",
        }}
      />
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
