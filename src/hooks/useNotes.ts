import { useEffect, useState } from "react";
import type { NoteData } from "../types";

const STORAGE_KEY = "notes";

const loadNotes = (): NoteData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data) as NoteData[];
    return parsed.map((n, i) => ({ ...n, zIndex: n.zIndex ?? i + 1 }));
  } catch {
    return [];
  }
};

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteData[]>(loadNotes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<NoteData, "id" | "zIndex">) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.zIndex), 0);
      return [...prev, { ...note, id: crypto.randomUUID(), zIndex: maxZ + 1 }];
    });
  };

  const updateNote = (id: string, updatedFields: Partial<NoteData>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updatedFields } : note,
      ),
    );
  };

  const bringNoteToFront = (id: string) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.zIndex), 0);
      const target = prev.find((n) => n.id === id);
      if (!target || target.zIndex === maxZ) return prev;
      return prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  };

  return { notes, addNote, updateNote, bringNoteToFront };
};
