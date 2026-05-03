import { Button, Center, Container, Flex, Group, Stack, Text, Title } from "@mantine/core";
import type { Guess, ImageEntry, ImagePair } from "src/features/game/types";
import { GamePair } from "./GamePair";
import { GameProgress } from "./GameProgress";
import { useTimeUntilMidnight } from "src/hooks/useTimeUntilMidnight";

interface GameBoardProps {
  activeIndex: number;
  guesses: Guess[];
  imagePair: ImagePair | undefined;
  isGameOver: boolean;
  onGuess: (image: ImageEntry) => void;
  onNavigate: (index: number) => void;
  onShowResults: () => void;
  totalRounds: number;
}

function GameBoard({
  activeIndex,
  guesses,
  imagePair,
  isGameOver,
  onGuess,
  onNavigate,
  onShowResults,
  totalRounds,
}: GameBoardProps) {
  const timeUntilMidnight = useTimeUntilMidnight();

  return (
    <Flex h="calc(100dvh - var(--app-shell-header-height))" direction="column">
      <Center flex={1}>
        <Stack>
          <Title ta="center" order={4}>Which one is slop?</Title>
          <GamePair
            imagePair={imagePair}
            isGameOver={isGameOver}
            onGuess={onGuess}
          />
        </Stack>
      </Center>
      <Container mb="xl" mt="sm">
        <Stack gap="lg" align="center">
          {isGameOver && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed" style={{ fontVariantNumeric: "tabular-nums" }}>
                {`Back in ${timeUntilMidnight}`}
              </Text>
              <Button variant="default" size="xs" onClick={onShowResults}>
                Results
              </Button>
            </Group>
          )}
          <GameProgress
            guesses={guesses}
            isGameOver={isGameOver}
            onNavigate={onNavigate}
            totalRounds={totalRounds}
            activeIndex={activeIndex}
          />
        </Stack>
      </Container>
    </Flex>
  );
}

export { GameBoard };
