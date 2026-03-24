import { Card, Image } from "@mantine/core";
import type { ImageEntry } from "src/features/game/types";
import classes from "./GameImage.module.css";
import { useCallback } from "react";

interface GameImageProps {
  image: ImageEntry | undefined;
  onGuess: (image: ImageEntry) => void;
}

function GameImage({
  image,
  onGuess,
}: GameImageProps) {
  const handleClick = useCallback(() => {
    if (!image) {
      return;
    }

    onGuess(image);
  }, [image, onGuess]);

  return (
    <Card
      className={classes.card}
      component="button"
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
