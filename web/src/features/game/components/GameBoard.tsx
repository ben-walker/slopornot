import type { Answer, Guess, GuessPhase, ImageEntry } from "src/features/game/types";
import { Box, Button, Card, Container, Flex, Group, Skeleton, Stack, Text } from "@mantine/core";
import { GameCarousel } from "./GameCarousel";
import { GameProgress } from "./GameProgress";
import { TOTAL_ROUNDS } from "src/features/game/constants";
import classes from "./GameBoard.module.css";
import { useTimeUntilMidnight } from "src/hooks/useTimeUntilMidnight";

interface GameBoardProps {
  activeIndex: number;
  guesses: Guess[];
  images: ImageEntry[];
  isGameOver: boolean;
  onGuess: (answer: Answer) => void;
  onNavigate: (index: number) => void;
  onShowResults: () => void;
  pendingGuess: Guess | undefined;
  phase: GuessPhase;
  totalRounds: number;
}

function GameBoard({
  activeIndex,
  guesses,
  images,
  isGameOver,
  onGuess,
  onNavigate,
  onShowResults,
  pendingGuess,
  phase,
  totalRounds,
}: GameBoardProps) {
  const timeUntilMidnight = useTimeUntilMidnight();

  const handleGuess = (answer: Answer) => () => {
    onGuess(answer);
  };

  const isButtonDisabled = images.length === 0 || phase !== "idle";
  const progressRounds = totalRounds || TOTAL_ROUNDS;

  return (
    <Flex h="calc(100dvh - var(--app-shell-header-height))" direction="column" gap="md">
      <Box className={classes.cardArea} flex={1} mih={0} px="md">
        <Stack h="100%" gap="sm" align="center" justify="center">
          {images.length === 0
            ? (
                <Card className={classes.placeholder} p={0} radius="md" shadow="md">
                  <Skeleton h="100%" w="100%" />
                </Card>
              )
            : (
                <GameCarousel
                  activeIndex={activeIndex}
                  guesses={guesses}
                  images={images}
                  isGameOver={isGameOver}
                  onNavigate={onNavigate}
                  pendingGuess={pendingGuess}
                  phase={phase}
                />
              )}
          {!isGameOver && (
            <Group grow w="100%" maw={400}>
              <Button
                variant="default"
                disabled={isButtonDisabled}
                onClick={handleGuess("real")}
              >
                Real
              </Button>
              <Button
                variant="default"
                disabled={isButtonDisabled}
                onClick={handleGuess("ai")}
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
            count={progressRounds}
            activeIndex={activeIndex}
          />
        </Stack>
      </Container>
    </Flex>
  );
}

export { GameBoard };
