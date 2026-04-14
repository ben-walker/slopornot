import { GameBoard } from "./GameBoard";
import { GameOver } from "./GameOver";
import { useGame } from "src/features/game/hooks/useGame";

function GameContainer() {
  const {
    activeIndex,
    currentPair,
    guesses,
    isGameOver,
    onGuess,
    onNavigate,
    totalRounds,
  } = useGame();

  return (
    <>
      <GameOver
        guesses={guesses}
        isOpen={isGameOver}
        totalRounds={totalRounds}
      />
      <GameBoard
        activeIndex={activeIndex}
        guesses={guesses}
        imagePair={currentPair}
        isGameOver={isGameOver}
        onGuess={onGuess}
        onNavigate={onNavigate}
        totalRounds={totalRounds}
      />
    </>
  );
}

export { GameContainer };
