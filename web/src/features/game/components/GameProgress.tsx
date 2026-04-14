import { Box, Group } from "@mantine/core";
import type { Guess } from "src/features/game/types";
import classes from "./GameProgress.module.css";

const PROGRESS_SIZE = 20;

interface GameProgressProps {
  activeIndex: number;
  guesses: Guess[];
  isGameOver: boolean;
  onNavigate: (index: number) => void;
  totalRounds: number;
}

function GameProgress({
  activeIndex,
  guesses,
  isGameOver,
  onNavigate,
  totalRounds,
}: GameProgressProps) {
  const onClick = (index: number) => () => {
    if (!isGameOver) {
      return;
    }

    onNavigate(index);
  };

  return (
    <Group>
      {Array.from({ length: totalRounds }).map((_, index) => {
        const guess = guesses[index];

        return (
          <Box
            // eslint-disable-next-line react-x/no-array-index-key
            key={index}
            className={classes.progress}
            data-is-active={index === activeIndex}
            data-is-correct={guess?.isCorrect}
            data-is-game-over={isGameOver}
            h={PROGRESS_SIZE}
            onClick={onClick(index)}
            w={PROGRESS_SIZE}
          />
        );
      })}
    </Group>
  );
}

export { GameProgress };
