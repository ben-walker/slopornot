import { Card, Image } from "@mantine/core";
import type { ImageEntry } from "../types";
import classes from "./GameImage.module.css";

interface GameImageProps {
  image: ImageEntry | undefined;
}

function GameImage({
  image,
}: GameImageProps) {
  return (
    <Card
      className={classes.card}
      component="button"
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
