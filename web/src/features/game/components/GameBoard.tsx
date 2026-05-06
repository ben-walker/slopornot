import { Box, Button, Container, Flex, Group, Stack, Text, Title } from "@mantine/core";
import type { Guess, ImageEntry, ImagePair } from "src/features/game/types";
import { GamePair } from "./GamePair";
import { GameProgress } from "./GameProgress";
import classes from "./GameBoard.module.css";
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
      <Box className={classes.pairArea} flex={1} mih={0} p="md">
        <Stack h="100%" gap="sm" align="center" justify="center">
          <Title ta="center" order={4}>Which one is slop?</Title>
          <GamePair
            imagePair={imagePair}
            isGameOver={isGameOver}
            onGuess={onGuess}
          />
        </Stack>
      </Box>
      <Container mb="xl" mt="sm">
        <Stack gap="lg" align="center">
          {isGameOver && (
            <Group justify="space-between">
              <Text className={classes.countdownText} size="sm" c="dimmed">
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
