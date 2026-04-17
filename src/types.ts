export type NoteData = {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  height: number;
  width: number;
  color: string;
  zIndex: number;
};
