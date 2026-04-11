import type { Games, ImageEntry } from "src/features/game/types";
import { useCallback, useMemo } from "react";
import { STORAGE_KEY_GAME } from "src/features/game/constants";
import { buildImagePairs } from "src/features/game/utils";
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

  const guesses = games[today]?.guesses ?? [];
  const totalRounds = imagePairs.length;
  const completedRounds = guesses.length;
  const isGameOver = totalRounds > 0 && completedRounds >= totalRounds;
  const currentPair = imagePairs[completedRounds];

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
  }, [setGames, today]);

  return {
    completedRounds,
    currentPair,
    guesses,
    isGameOver,
    onGuess,
    totalRounds,
  };
}

export { useGame };
