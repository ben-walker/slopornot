import type { Games, ImageEntry } from "../types";
import { useCallback, useMemo } from "react";
import { GameBoard } from "./GameBoard";
import { STORAGE_KEY_GAME } from "../constants";
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

  const currentRoundIndex = games[today]?.guesses.length ?? 0;
  const isGameOver = imagePairs.length > 0 && currentRoundIndex >= imagePairs.length;

  const onGuess = useCallback((image: ImageEntry) => {
    setGames(prev => ({
      ...prev,
      [today]: {
        guesses: [...(prev[today]?.guesses ?? []), { isCorrect: image.isAi }],
      },
    }));
  }, [setGames, today]);

  return (
    <GameBoard
      imagePair={imagePairs[currentRoundIndex]}
      onGuess={onGuess}
    />
  );
}

export { GameContainer };
