import { useCallback, useEffect, useState } from "react";
import type { NoteData } from "../types";

const STORAGE_KEY = "notes";
const PERSIST_DELAY = 500;

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

  // Debounce persistence so typing in a note doesn't hit localStorage on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, PERSIST_DELAY);
    return () => clearTimeout(t);
  }, [notes]);

  const addNote = useCallback((note: Omit<NoteData, "id" | "zIndex">) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.zIndex), 0);
      return [...prev, { ...note, id: crypto.randomUUID(), zIndex: maxZ + 1 }];
    });
  }, []);

  const updateNote = useCallback(
    (id: string, updatedFields: Partial<NoteData>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updatedFields } : note,
        ),
      );
    },
    [],
  );

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.zIndex), 0);
      const target = prev.find((n) => n.id === id);
      if (!target || target.zIndex === maxZ) return prev;
      return prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return { notes, addNote, updateNote, bringToFront, removeNote };
};
