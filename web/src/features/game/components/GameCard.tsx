import { Box, Card, Image, Skeleton } from "@mantine/core";
import type { Guess, GuessPhase, ImageEntry } from "src/features/game/types";
import { GameAttribution } from "./GameAttribution";
import { GameRing } from "./GameRing";
import classes from "./GameCard.module.css";

interface GameCardProps {
  guess: Guess | undefined;
  image: ImageEntry | undefined;
  pendingGuess: Guess | undefined;
  phase: GuessPhase;
}

function GameCard({ guess, image, pendingGuess, phase }: GameCardProps) {
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
      {pendingGuess && phase !== "idle" && (
        <Box className={classes.ringWrapper}>
          <GameRing isCorrect={pendingGuess.isCorrect} phase={phase} />
        </Box>
      )}
      {guess && image && (
        <Box className={classes.attribution}>
          <GameAttribution
            attribution={image.attribution}
            isCorrect={guess.isCorrect}
            phase={phase}
          />
        </Box>
      )}
    </Card>
  );
}

export { GameCard };
