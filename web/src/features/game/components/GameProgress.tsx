import { Box, Group } from "@mantine/core";
import type { Guess } from "src/features/game/types";
import classes from "./GameProgress.module.css";

const PROGRESS_SIZE = 20;

interface GameProgressProps {
  guesses: Guess[];
  totalRounds: number;
}

function GameProgress({
  guesses,
  totalRounds,
}: GameProgressProps) {
  return (
    <Group>
      {Array.from({ length: totalRounds }).map((_, index) => {
        const guess = guesses[index];

        return (
          <Box
            // eslint-disable-next-line react-x/no-array-index-key
            key={index}
            className={classes.progress}
            data-is-correct={guess?.isCorrect}
            h={PROGRESS_SIZE}
            w={PROGRESS_SIZE}
          />
        );
      })}
    </Group>
  );
}

export { GameProgress };
