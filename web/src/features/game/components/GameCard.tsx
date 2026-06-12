import { Box, Card, Center, Image, RingProgress, Skeleton } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import type { Guess, GuessPhase, ImageEntry } from "src/features/game/types";
import { useEffect, useState } from "react";
import { ANTICIPATION_DELAY_MS } from "src/features/game/constants";
import { GameAttribution } from "./GameAttribution";
import { GlassPaper } from "src/components/GlassPaper";
import classes from "./GameCard.module.css";

const RING_ICON_SIZE = 26;
const RING_SIZE = 82;
const RING_THICKNESS = 8;

interface GameCardProps {
  guess: Guess | undefined;
  image: ImageEntry | undefined;
  pendingGuess: Guess | undefined;
  phase: GuessPhase;
}

function GameCard({ guess, image, pendingGuess, phase }: GameCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === "idle") {
      setProgress(0);
      return;
    }

    if (phase === "revealed") {
      setProgress(100);
      return;
    }

    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / ANTICIPATION_DELAY_MS) * 100);
      setProgress(next);

      if (next < 100) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [phase]);

  const ringColor = phase === "revealed"
    ? (pendingGuess?.isCorrect ? "correct" : "incorrect")
    : "correct";

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
        <GlassPaper
          className={classes.ringWrapper}
          data-phase={phase}
          p="xs"
          radius="lg"
          shadow="xl"
          withBorder
        >
          <RingProgress
            sections={[{ value: progress, color: ringColor }]}
            size={RING_SIZE}
            thickness={RING_THICKNESS}
            roundCaps
            label={
              phase === "revealed"
                ? (
                    <Center>
                      <Box
                        className={classes.ringInnerCircle}
                        data-is-correct={pendingGuess.isCorrect}
                      >
                        {pendingGuess.isCorrect
                          ? <CheckIcon size={RING_ICON_SIZE} weight="bold" />
                          : <XIcon size={RING_ICON_SIZE} weight="bold" />}
                      </Box>
                    </Center>
                  )
                : null
            }
          />
        </GlassPaper>
      )}
      {image && guess !== undefined && (
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
