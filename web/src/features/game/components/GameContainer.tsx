import { AWARD_IDS } from "src/awards/types";
import { GameBoard } from "./GameBoard";
import { GameResultsModal } from "./GameResultsModal";
import { useAwards } from "src/awards/hooks/useAwards";
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
    streak,
    totalRounds,
  } = useGame();

  const { unlockAward, unlockStreakAwards } = useAwards();

  const [isResultsOpen, { open: openResults, close: closeResults }] = useDisclosure(false);

  useEffect(() => {
    if (isGameOver) {
      openResults();
    }
  }, [isGameOver, openResults]);

  useEffect(() => {
    unlockStreakAwards(streak);
  }, [streak, unlockStreakAwards]);

  useEffect(() => {
    if (!isGameOver) {
      return;
    }

    if (guesses.every(guess => guess.isCorrect)) {
      unlockAward(AWARD_IDS.perfectSet);
    }

    if (guesses.every(guess => !guess.isCorrect)) {
      unlockAward(AWARD_IDS.failedSet);
    }
  }, [guesses, isGameOver, unlockAward]);

  return (
    <>
      <GameResultsModal
        averageCorrect={averageCorrect}
        guesses={guesses}
        history={history}
        isOpen={isResultsOpen}
        onClose={closeResults}
        streak={streak}
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
