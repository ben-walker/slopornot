import type { Games, ImageEntry } from "src/features/game/types";
import { useCallback, useMemo } from "react";
import { GameBoard } from "./GameBoard";
import { GameOver } from "./GameOver";
import { STORAGE_KEY_GAME } from "src/features/game/constants";
import { buildImagePairs } from "src/features/game/utils";
import { format } from "date-fns";
import { useGetSetsDate } from "src/api/generated";
import { useLocalStorage } from "@mantine/hooks";

function GameContainer() {
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
  const currentRoundIndex = guesses.length;
  const isGameOver = totalRounds > 0 && currentRoundIndex >= totalRounds;

  const onGuess = useCallback((image: ImageEntry) => {
    setGames((prev) => {
      const todayPrevGuesses = prev[today]?.guesses ?? [];

      return {
        ...prev,
        [today]: {
          guesses: [...todayPrevGuesses, { isCorrect: image.isAi }],
        },
      };
    });
  }, [setGames, today]);

  return (
    <>
      <GameOver
        guesses={guesses}
        isOpen={isGameOver}
        totalRounds={totalRounds}
      />
      <GameBoard
        guesses={guesses}
        imagePair={imagePairs[currentRoundIndex]}
        onGuess={onGuess}
        totalRounds={totalRounds}
      />
    </>
  );
}

export { GameContainer };
