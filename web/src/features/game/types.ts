type Answer = "real" | "ai";

type GuessPhase = "idle" | "pending" | "revealed";

interface Guess {
  answer: Answer;
  imageId: string;
  isCorrect: boolean;
}

interface Game {
  guesses: Guess[];
  totalRounds: number;
}

type Games = Record<string, Game | undefined>;

interface ImageEntry {
  id: string;
  storageUrl: string;
  isAi: boolean;
}

interface HistoryEntry {
  accuracy: number;
  date: string;
}

type PerformanceTier = "perfect" | "great" | "good" | "ok" | "poor" | "terrible";

export type {
  Answer,
  Guess,
  GuessPhase,
  Game,
  Games,
  HistoryEntry,
  ImageEntry,
  PerformanceTier,
};
