import { DEFAULT_SESSION_NOTE } from "./constants";

/** 履歴の重複判定用に正規化 */
export function normalizeStudyNote(note: string): string {
  return note.trim();
}

/** 未登録の学習名のみ先頭に追加（重複は追加しない） */
export function addStudyNoteToHistory(
  history: string[],
  note: string
): string[] {
  const normalized = normalizeStudyNote(note);

  if (!normalized || normalized === DEFAULT_SESSION_NOTE) {
    return history;
  }

  if (history.includes(normalized)) {
    return history;
  }

  return [normalized, ...history];
}

export function removeStudyNoteFromHistory(
  history: string[],
  note: string
): string[] {
  const normalized = normalizeStudyNote(note);
  return history.filter((item) => item !== normalized);
}
