import { Box, Card, Image, Skeleton } from "@mantine/core";
import type { Guess, GuessPhase, ImageEntry } from "src/features/game/types";
import { GameAttribution } from "./GameAttribution";
import { GameRing } from "./GameRing";
import classes from "./GameCard.module.css";
import { useState } from "react";

interface GameCardProps {
  guess: Guess | undefined;
  image: ImageEntry;
  pendingGuess: Guess | undefined;
  phase: GuessPhase;
  shouldLoad: boolean;
}

function GameCard({
  guess,
  image,
  pendingGuess,
  phase,
  shouldLoad,
}: GameCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Card
      className={classes.card}
      p={0}
      radius="md"
      shadow="md"
    >
      <Skeleton h="100%" visible={!isLoaded} w="100%">
        {shouldLoad && (
          <Image
            className={classes.image}
            onLoad={() => {
              setIsLoaded(true);
            }}
            src={image.storageUrl}
          />
        )}
      </Skeleton>
      {pendingGuess && phase !== "idle" && (
        <Box className={classes.ringWrapper}>
          <GameRing isCorrect={pendingGuess.isCorrect} phase={phase} />
        </Box>
      )}
      {guess && (
        <Box className={classes.attribution}>
          <GameAttribution
            attribution={image.attribution}
            isCorrect={guess.isCorrect}
            isRevealing={phase === "revealed"}
          />
        </Box>
      )}
    </Card>
  );
}

export { GameCard };
