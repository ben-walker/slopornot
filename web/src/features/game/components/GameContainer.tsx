import { GameBoard } from "./GameBoard";
import { GameResultsModal } from "./GameResultsModal";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useGame } from "src/features/game/hooks/useGame";

function GameContainer() {
  const {
    activeIndex,
    averageCorrect,
    guesses,
    history,
    images,
    isGameOver,
    onGuess,
    onNavigate,
    pendingGuess,
    phase,
    totalRounds,
  } = useGame();

  const [isResultsOpen, { open: openResults, close: closeResults }] = useDisclosure(false);

  useEffect(() => {
    if (isGameOver) {
      openResults();
    }
  }, [isGameOver, openResults]);

  return (
    <>
      <GameResultsModal
        averageCorrect={averageCorrect}
        guesses={guesses}
        history={history}
        isOpen={isResultsOpen}
        onClose={closeResults}
        totalRounds={totalRounds}
      />
      <GameBoard
        activeIndex={activeIndex}
        guesses={guesses}
        images={images}
        isGameOver={isGameOver}
        onGuess={onGuess}
        onNavigate={onNavigate}
        onShowResults={openResults}
        pendingGuess={pendingGuess}
        phase={phase}
        totalRounds={totalRounds}
      />
    </>
  );
}

export { GameContainer };
