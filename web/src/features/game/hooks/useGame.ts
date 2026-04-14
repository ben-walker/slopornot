import type { Games, ImageEntry } from "src/features/game/types";
import { buildImagePairs, clampImageIndex } from "src/features/game/utils";
import { useCallback, useMemo, useState } from "react";
import { STORAGE_KEY_GAME } from "src/features/game/constants";
import { format } from "date-fns";
import { useGetSetsDate } from "src/api/generated";
import { useLocalStorage } from "@mantine/hooks";

function useGame() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data } = useGetSetsDate(today);

  const imagePairs = useMemo(() => (
    buildImagePairs(data?.images)
  ), [data?.images]);

  const [games, setGames] = useLocalStorage<Games>({
    defaultValue: {},
    key: STORAGE_KEY_GAME,
  });

  const [viewingIndex, setViewingIndex] = useState(0);

  const guesses = games[today]?.guesses ?? [];
  const totalRounds = imagePairs.length;
  const completedRounds = guesses.length;
  const isGameOver = totalRounds > 0 && completedRounds >= totalRounds;
  const activeIndex = isGameOver ? viewingIndex : completedRounds;
  const currentPair = imagePairs[activeIndex];

  const onGuess = useCallback((image: ImageEntry) => {
    setGames((prev) => {
      const prevTodayGuesses = prev[today]?.guesses ?? [];

      return {
        ...prev,
        [today]: {
          guesses: [...prevTodayGuesses, { isCorrect: image.isAi }],
        },
      };
    });

    setViewingIndex(prev => clampImageIndex(prev + 1, totalRounds));
  }, [setGames, today, totalRounds]);

  const onNavigate = useCallback((index: number) => {
    setViewingIndex(clampImageIndex(index, totalRounds));
  }, [totalRounds]);

  return {
    activeIndex,
    completedRounds,
    currentPair,
    guesses,
    isGameOver,
    onGuess,
    onNavigate,
    totalRounds,
  };
}

export { useGame };
