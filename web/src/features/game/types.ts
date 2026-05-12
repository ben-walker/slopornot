interface Guess {
  isCorrect: boolean;
  selectedImageId: string;
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

interface ImagePair {
  left: ImageEntry;
  right: ImageEntry;
}

type PerformanceTier = "perfect" | "great" | "good" | "ok" | "poor" | "terrible";

export type {
  Guess,
  Game,
  Games,
  ImageEntry,
  ImagePair,
  PerformanceTier,
};
