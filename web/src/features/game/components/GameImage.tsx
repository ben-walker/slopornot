import { Card, Image } from "@mantine/core";
import type { ImageEntry } from "src/features/game/types";
import classes from "./GameImage.module.css";
import { useCallback } from "react";

interface GameImageProps {
  image: ImageEntry | undefined;
  isGameOver: boolean;
  onGuess: (image: ImageEntry) => void;
}

function GameImage({
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

  return (
    <Card
      className={classes.card}
      component="button"
      data-game-over={isGameOver}
      onClick={handleClick}
      radius="md"
      shadow="md"
      withBorder
    >
      <Card.Section>
        <Image
          className={classes.image}
          h={300}
          src={image?.storageUrl}
        />
      </Card.Section>
    </Card>
  );
}

export { GameImage };
