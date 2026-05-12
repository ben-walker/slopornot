import type { Guess, ImageEntry, ImagePair } from "src/features/game/types";
import { GameImage } from "./GameImage";
import { Group } from "@mantine/core";

interface GamePairProps {
  guess: Guess | undefined;
  imagePair: ImagePair | undefined;
  isGameOver: boolean;
  onGuess: (image: ImageEntry) => void;
}

function GamePair({
  guess,
  imagePair,
  isGameOver,
  onGuess,
}: GamePairProps) {
  return (
    <Group w="100%" gap="md" justify="center" align="center" wrap="nowrap">
      <GameImage
        guess={guess}
        image={imagePair?.left}
        isGameOver={isGameOver}
        onGuess={onGuess}
      />
      <GameImage
        guess={guess}
        image={imagePair?.right}
        isGameOver={isGameOver}
        onGuess={onGuess}
      />
    </Group>
  );
}

export { GamePair };
