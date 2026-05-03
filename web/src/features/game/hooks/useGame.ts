import type { Games, ImageEntry } from "src/features/game/types";
import { buildImagePairs, clampImageIndex } from "src/features/game/utils";
import { useCallback, useMemo, useState } from "react";
import { STORAGE_KEY_GAME } from "src/features/game/constants";
import { useGetSetsDate } from "src/api/generated";
import { useLocalStorage } from "@mantine/hooks";
import { useToday } from "src/hooks/useToday";

function useGame() {
  const today = useToday();

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

  const averageCorrect = useMemo(() => {
    const completedGames = Object.values(games).filter(
      game => game !== undefined && game.guesses.length === game.totalRounds,
    );

    if (!completedGames.length) {
      return 0;
    }

    const correctRateSum = completedGames.reduce((sum, game) => {
      if (game === undefined) {
        return sum;
      }

      return sum + game.guesses.filter(guess => guess.isCorrect).length / game.totalRounds;
    }, 0);

    return correctRateSum / completedGames.length;
  }, [games]);

  const onGuess = useCallback((image: ImageEntry) => {
    setGames((prev) => {
      const prevTodayGuesses = prev[today]?.guesses ?? [];

      return {
        ...prev,
        [today]: {
          guesses: [...prevTodayGuesses, { isCorrect: image.isAi }],
          totalRounds,
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
    averageCorrect,
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
