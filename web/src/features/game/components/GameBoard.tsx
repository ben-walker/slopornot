import { Center, Container, Flex, Stack, Title } from "@mantine/core";
import type { Guess, ImageEntry, ImagePair } from "src/features/game/types";
import { GamePair } from "./GamePair";
import { GameProgress } from "./GameProgress";

interface GameBoardProps {
  guesses: Guess[];
  imagePair: ImagePair | undefined;
  onGuess: (image: ImageEntry) => void;
  totalRounds: number;
}

function GameBoard({
  guesses,
  imagePair,
  totalRounds,
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
      <Container mb="xl" mt="sm">
        <GameProgress
          guesses={guesses}
          totalRounds={totalRounds}
        />
      </Container>
    </Flex>
  );
}

export { GameBoard };
