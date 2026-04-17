import { useNotes } from "../hooks/useNotes";
import { Note } from "./Note";

export const Board = () => {
  const { notes, addNote, updateNote, bringNoteToFront } = useNotes();

  const handleAdd = () => {
    addNote({
      content: "",
      position: { x: 100, y: 100 },
      width: 200,
      height: 200,
      color: "#ffdb38",
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "gray",
      }}
    >
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

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onMove={(id, x, y) => updateNote(id, { position: { x, y } })}
          onResize={(id, width, height) => updateNote(id, { width, height })}
          onNoteChange={(id, content) => updateNote(id, { content })}
          onBringToFront={(id) => bringNoteToFront(id)}
        />
      ))}
    </div>
  );
};
