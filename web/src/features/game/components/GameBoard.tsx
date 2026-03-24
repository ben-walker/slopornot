import { Center, Flex, Stack, Title } from "@mantine/core";
import type { ImageEntry, ImagePair } from "src/features/game/types";
import { GamePair } from "./GamePair";

interface GameBoardProps {
  imagePair: ImagePair | undefined;
  onGuess: (image: ImageEntry) => void;
}

function GameBoard({
  imagePair,
  onGuess,
}: GameBoardProps) {
  return (
    <Flex h="calc(100dvh - var(--app-shell-header-height))" direction="column">
      <Center flex={1}>
        <Stack>
          <Title ta="center" order={4}>Which one is slop?</Title>
          <GamePair
            imagePair={imagePair}
            onGuess={onGuess}
          />
        </Stack>
      </Center>
    </Flex>
  );
}

export { GameBoard };
