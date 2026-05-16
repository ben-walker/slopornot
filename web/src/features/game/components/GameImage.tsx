import { Box, Card, Group, Image, Text } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import type { Guess, ImageEntry } from "src/features/game/types";
import classes from "./GameImage.module.css";
import { useCallback } from "react";

const ICON_SIZE = 20;

interface GameImageProps {
  guess: Guess | undefined;
  image: ImageEntry | undefined;
  isGameOver: boolean;
  onGuess: (image: ImageEntry) => void;
}

function GameImage({
  guess,
  image,
  isGameOver,
  onGuess,
}: GameImageProps) {
  const handleClick = useCallback(() => {
    if (!image || isGameOver) {
      return;
    }

    onGuess(image);
  }, [image, isGameOver, onGuess]);

  const isSelected = guess?.selectedImageId === image?.id;

  return (
    <Card
      className={classes.card}
      component="button"
      data-is-game-over={isGameOver}
      data-is-selected={isSelected}
      onClick={handleClick}
      p={0}
      radius="md"
      shadow="md"
    >
      <Image
        className={classes.image}
        src={image?.storageUrl}
      />
      {guess !== undefined && image?.isAi && (
        <Box className={classes.label} data-is-correct={guess.isCorrect}>
          <Group gap="xs" justify="center" c="white">
            {guess.isCorrect
              ? <CheckIcon size={ICON_SIZE} weight="bold" />
              : <XIcon size={ICON_SIZE} weight="bold" />}
            <Text fw="bold">Slop</Text>
          </Group>
        </Box>
      )}
    </Card>
  );
}

export { GameImage };
