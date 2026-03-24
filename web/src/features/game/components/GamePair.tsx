import type { ImageEntry, ImagePair } from "src/features/game/types";
import { GameImage } from "./GameImage";
import { Group } from "@mantine/core";

interface GamePairProps {
  imagePair: ImagePair | undefined;
  onGuess: (image: ImageEntry) => void;
}

function GamePair({
  imagePair,
  onGuess,
}: GamePairProps) {
  return (
    <Group>
      <GameImage
        image={imagePair?.left}
        onGuess={onGuess}
      />
      <GameImage
        image={imagePair?.right}
        onGuess={onGuess}
      />
    </Group>
  );
}

export { GamePair };
