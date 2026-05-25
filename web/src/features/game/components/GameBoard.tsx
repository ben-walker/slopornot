import type { Answer, Guess, ImageEntry } from "src/features/game/types";
import { Box, Button, Container, Flex, Group, Stack, Text } from "@mantine/core";
import { GameCard } from "./GameCard";
import { GameProgress } from "./GameProgress";
import classes from "./GameBoard.module.css";
import { useTimeUntilMidnight } from "src/hooks/useTimeUntilMidnight";

interface GameBoardProps {
  activeIndex: number;
  currentGuess: Guess | undefined;
  guesses: Guess[];
  image: ImageEntry;
  isGameOver: boolean;
  onGuess: (image: ImageEntry, answer: Answer) => void;
  onNavigate: (index: number) => void;
  onShowResults: () => void;
  totalRounds: number;
}

function GameBoard({
  activeIndex,
  currentGuess,
  guesses,
  image,
  isGameOver,
  onGuess,
  onNavigate,
  onShowResults,
  totalRounds,
}: GameBoardProps) {
  const timeUntilMidnight = useTimeUntilMidnight();

  return (
    <Flex h="calc(100dvh - var(--app-shell-header-height))" direction="column" gap="md">
      <Box className={classes.cardArea} flex={1} mih={0} px="md">
        <Stack h="100%" gap="sm" align="center" justify="center">
          <GameCard guess={currentGuess} image={image} />
          {!isGameOver && (
            <Group grow w="100%" maw={400}>
              <Button
                variant="default"
                onClick={() => { onGuess(image, "real"); }}
              >
                Real
              </Button>
              <Button
                variant="default"
                onClick={() => { onGuess(image, "ai"); }}
              >
                Slop
              </Button>
            </Group>
          )}
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
