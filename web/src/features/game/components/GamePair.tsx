import type { ImageEntry, ImagePair } from "src/features/game/types";
import { GameImage } from "./GameImage";
import { Group } from "@mantine/core";

interface GamePairProps {
  imagePair: ImagePair | undefined;
  isGameOver: boolean;
  onGuess: (image: ImageEntry) => void;
}

function GamePair({
  imagePair,
  isGameOver,
  onGuess,
}: GamePairProps) {
  return (
    <Group>
      <GameImage
        image={imagePair?.left}
        isGameOver={isGameOver}
        onGuess={onGuess}
      />
      <GameImage
        image={imagePair?.right}
        isGameOver={isGameOver}
        onGuess={onGuess}
      />
    </Group>
  );
}

export { GamePair };
