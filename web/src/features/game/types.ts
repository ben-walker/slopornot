type Answer = "real" | "ai";

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

interface RealAttribution {
  kind: "real";
  sourceId: string;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
}

interface AiAttribution {
  kind: "ai";
  model: string;
}

type Attribution = RealAttribution | AiAttribution;

interface ImageEntry {
  id: string;
  storageUrl: string;
  isAi: boolean;
  attribution: Attribution;
}

interface HistoryEntry {
  accuracy: number;
  date: string;
}

type PerformanceTier = "perfect" | "great" | "good" | "ok" | "poor" | "terrible";

export type {
  Answer,
  Attribution,
  Guess,
  Game,
  Games,
  HistoryEntry,
  ImageEntry,
  PerformanceTier,
};
