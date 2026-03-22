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
  ImageEntry,
  ImagePair,
};
