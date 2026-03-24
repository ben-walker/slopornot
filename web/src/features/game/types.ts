interface Guess {
  isCorrect: boolean;
}

interface Game {
  guesses: Guess[];
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

export type {
  Guess,
  Game,
  Games,
  ImageEntry,
  ImagePair,
};
