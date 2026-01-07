
export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  HARD = 'Difícil'
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizSettings {
  count: number;
  difficulty: Difficulty;
}

export interface PDFData {
  name: string;
  text: string;
  pageCount: number;
}
