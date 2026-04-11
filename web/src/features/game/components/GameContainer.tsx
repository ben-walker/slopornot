import { GameBoard } from "./GameBoard";
import { GameOver } from "./GameOver";
import { useGame } from "src/features/game/hooks/useGame";

function GameContainer() {
  const {
    currentPair,
    guesses,
    isGameOver,
    onGuess,
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
        guesses={guesses}
        imagePair={currentPair}
        onGuess={onGuess}
        totalRounds={totalRounds}
      />
    </>
  );
}

export { GameContainer };
