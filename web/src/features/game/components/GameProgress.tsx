import { Box, Group } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import type { Guess } from "src/features/game/types";
import classes from "./GameProgress.module.css";

const PROGRESS_SIZE = 28;
const ICON_SIZE = 16;

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
            className={classes.step}
            data-is-active={index === activeIndex}
            data-is-correct={guess?.isCorrect}
            data-is-game-over={isGameOver}
            h={PROGRESS_SIZE}
            onClick={onClick(index)}
            w={PROGRESS_SIZE}
          >
            {guess !== undefined && (
              guess.isCorrect
                ? <CheckIcon size={ICON_SIZE} weight="bold" />
                : <XIcon size={ICON_SIZE} weight="bold" />
            )}
          </Box>
        );
      })}
    </Group>
  );
}

export { GameProgress };
