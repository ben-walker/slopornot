import { Card, Image } from "@mantine/core";
import type { Guess, ImageEntry } from "src/features/game/types";
import classes from "./GameImage.module.css";
import { useCallback } from "react";

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
      withBorder
    >
      <Image
        className={classes.image}
        src={image?.storageUrl}
      />
    </Card>
  );
}

export { GameImage };
