import { GameImage } from "./GameImage";
import { Group } from "@mantine/core";
import type { ImagePair } from "src/features/game/types";

interface GamePairProps {
  imagePair: ImagePair | undefined;
}

function GamePair({
  imagePair,
}: GamePairProps) {
  return (
    <Group>
      <GameImage image={imagePair?.left} />
      <GameImage image={imagePair?.right} />
    </Group>
  );
}

export { GamePair };
