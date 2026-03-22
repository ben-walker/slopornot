import { Center, Flex, Stack, Title } from "@mantine/core";
import { GamePair } from "./GamePair";
import type { ImagePair } from "src/features/game/types";

interface GameBoardProps {
  imagePairs: ImagePair[];
}

function GameBoard({
  imagePairs,
}: GameBoardProps) {
  // TODO: cycle through pairs based on current round
  const firstPair = imagePairs[0];

  return (
    <Flex h="calc(100dvh - var(--app-shell-header-height))" direction="column">
      <Center flex={1}>
        <Stack>
          <Title ta="center" order={4}>Which one is slop?</Title>
          <GamePair imagePair={firstPair} />
        </Stack>
      </Center>
    </Flex>
  );
}

export { GameBoard };
