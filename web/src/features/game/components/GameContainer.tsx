import { chunkIntoRows, hasSameScoreRun } from "src/features/game/utils";
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

    const results = guesses.map(guess => guess.isCorrect);

    if (results.every(Boolean)) {
      unlockAward(AWARD_IDS.perfectSet);
    }

    if (results.every(result => !result)) {
      unlockAward(AWARD_IDS.failedSet);
    }

    const isMixed = results.some(Boolean) && results.some(result => !result);
    const isSymmetric = chunkIntoRows(results).every(row => (
      row.every((result, i) => result === row[row.length - 1 - i])
    ));

    if (isMixed && isSymmetric) {
      unlockAward(AWARD_IDS.symmetric);
    }
  }, [guesses, isGameOver, unlockAward]);

  useEffect(() => {
    if (!isGameOver) {
      return;
    }

    if (hasSameScoreRun(history, 3)) {
      unlockAward(AWARD_IDS.hatTrick);
    }
  }, [history, isGameOver, unlockAward]);

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
