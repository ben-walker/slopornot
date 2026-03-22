import { GameBoard } from "./GameBoard";
import { buildImagePairs } from "src/features/game/utils";
import { format } from "date-fns";
import { useGetSetsDate } from "src/api/generated";
import { useMemo } from "react";

function GameContainer() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data } = useGetSetsDate(today);

  const imagePairs = useMemo(() => (
    buildImagePairs(data?.images)
  ), [data?.images]);

  return (
    <GameBoard
      imagePairs={imagePairs}
    />
  );
}

export { GameContainer };
