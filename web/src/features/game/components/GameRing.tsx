import { Box, Center, RingProgress } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ANTICIPATION_DELAY_MS } from "src/features/game/constants";
import { GlassPaper } from "src/components/GlassPaper";
import type { GuessPhase } from "src/features/game/types";
import classes from "./GameRing.module.css";

const ICON_SIZE = 26;
const SIZE = 82;
const THICKNESS = 8;

interface GameRingProps {
  isCorrect: boolean;
  phase: GuessPhase;
}

function GameRing({ isCorrect, phase }: GameRingProps) {
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
    ? (isCorrect ? "correct" : "incorrect")
    : "correct";

  return (
    <GlassPaper
      data-phase={phase}
      p="xs"
      radius="lg"
      shadow="xl"
      withBorder
    >
      <RingProgress
        sections={[{ value: progress, color: ringColor }]}
        size={SIZE}
        thickness={THICKNESS}
        roundCaps
        label={
          phase === "revealed"
            ? (
                <Center>
                  <Box
                    className={classes.innerCircle}
                    data-is-correct={isCorrect}
                  >
                    {isCorrect
                      ? <CheckIcon size={ICON_SIZE} weight="bold" />
                      : <XIcon size={ICON_SIZE} weight="bold" />}
                  </Box>
                </Center>
              )
            : null
        }
      />
    </GlassPaper>
  );
}

export { GameRing };
