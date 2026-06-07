import { Box, Card, Image, Skeleton } from "@mantine/core";
import type { Guess, ImageEntry } from "src/features/game/types";
import { GameAttribution } from "./GameAttribution";
import classes from "./GameCard.module.css";

interface GameCardProps {
  guess: Guess | undefined;
  image: ImageEntry | undefined;
}

function GameCard({ guess, image }: GameCardProps) {
  return (
    <Card
      className={classes.card}
      p={0}
      radius="md"
      shadow="md"
    >
      {image
        ? (
            <Image
              className={classes.image}
              src={image.storageUrl}
            />
          )
        : <Skeleton h="100%" w="100%" />}
      {image && guess !== undefined && (
        <Box className={classes.attribution}>
          <GameAttribution
            attribution={image.attribution}
            isCorrect={guess.isCorrect}
          />
        </Box>
      )}
    </Card>
  );
}

export { GameCard };
