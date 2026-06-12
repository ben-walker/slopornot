import type { Answer, Games, Guess, GuessPhase, HistoryEntry, ImageEntry } from "src/features/game/types";
import { PHASE_DURATIONS_MS, STORAGE_KEY_GAME } from "src/features/game/constants";
import { buildImageEntry, clampImageIndex, shuffleImages } from "src/features/game/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetSetsDate } from "src/api/generated";
import { useLocalStorage } from "@mantine/hooks";
import { useToday } from "src/hooks/useToday";

function useGame() {
  const today = useToday();

  const { data } = useGetSetsDate(today);

  const images = useMemo(() => {
    if (!data?.images) {
      return [];
    }

    const imageEntries = data.images.map(buildImageEntry);

    return shuffleImages(imageEntries, today);
  }, [data?.images, today]);

  const [games, setGames] = useLocalStorage<Games>({
    defaultValue: {},
    key: STORAGE_KEY_GAME,
  });

  const [viewingIndex, setViewingIndex] = useState(0);
  const [pendingGuess, setPendingGuess] = useState<Guess | undefined>(undefined);
  const [phase, setPhase] = useState<GuessPhase>("idle");

  const guesses = games[today]?.guesses ?? [];
  const totalRounds = images.length;
  const completedRounds = guesses.length;
  const isGameOver = totalRounds > 0 && completedRounds >= totalRounds;
  const activeIndex = isGameOver ? viewingIndex : completedRounds;
  const currentImage = images[activeIndex];
  const currentGuess = guesses[activeIndex] ?? (phase === "revealed" ? pendingGuess : undefined);

  const history = useMemo<HistoryEntry[]>(() => {
    return Object.entries(games)
      .flatMap(([date, game]) => {
        if (game === undefined || game.guesses.length !== game.totalRounds) {
          return [];
        }

        const correct = game.guesses.filter(guess => guess.isCorrect).length;

        return [{ accuracy: (correct / game.totalRounds) * 100, date }];
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [games]);

  const averageCorrect = useMemo(() => {
    if (!history.length) {
      return 0;
    }

    return history.reduce((sum, entry) => sum + entry.accuracy, 0) / history.length / 100;
  }, [history]);

  const onGuess = useCallback((image: ImageEntry, answer: Answer) => {
    if (phase !== "idle") {
      return;
    }

    const isCorrect = (answer === "ai") === image.isAi;

    setPendingGuess({ answer, imageId: image.id, isCorrect });
    setPhase("pending");
  }, [phase]);

  useEffect(() => {
    if (phase === "pending") {
      const timeoutId = setTimeout(() => {
        setPhase("revealed");
      }, PHASE_DURATIONS_MS.pending);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    if (phase === "revealed") {
      const timeoutId = setTimeout(() => {
        if (pendingGuess) {
          setGames((prev) => {
            const prevTodayGuesses = prev[today]?.guesses ?? [];

            return {
              ...prev,
              [today]: {
                guesses: [...prevTodayGuesses, pendingGuess],
                totalRounds,
              },
            };
          });
        }

        setViewingIndex(prev => clampImageIndex(prev + 1, totalRounds));
        setPendingGuess(undefined);
        setPhase("idle");
      }, PHASE_DURATIONS_MS.revealed);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, pendingGuess, setGames, today, totalRounds]);

  const onNavigate = useCallback((index: number) => {
    setViewingIndex(clampImageIndex(index, totalRounds));
  }, [totalRounds]);

  return {
    activeIndex,
    averageCorrect,
    completedRounds,
    currentGuess,
    currentImage,
    guesses,
    history,
    isGameOver,
    onGuess,
    onNavigate,
    pendingGuess,
    phase,
    totalRounds,
  };
}

export { useGame };
