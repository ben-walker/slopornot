import { Center, Modal, Stack, Text, Title } from "@mantine/core";
import type { Guess } from "src/features/game/types";
import { getTitle } from "src/features/game/utils";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useMemo } from "react";

interface GameOverProps {
  guesses: Guess[];
  isOpen: boolean;
  totalRounds: number;
}

function GameOver({
  guesses,
  isOpen,
  totalRounds,
}: GameOverProps) {
  const isMobile = useIsMobile();

  const correctCount = useMemo(() => (
    guesses.filter(guess => guess.isCorrect).length
  ), [guesses]);

  const title = useMemo(() => (
    getTitle(correctCount, totalRounds)
  ), [correctCount, totalRounds]);

  return (
    <Modal
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      fullScreen={isMobile}
      onClose={() => { /* noop */ }}
      opened={isOpen}
      size="auto"
      styles={{
        body: {
          height: "100%",
        },
      }}
      withCloseButton={false}
    >
      <Center h="100%">
        <Stack align="flex-start">
          <Title order={3}>{title}</Title>
          <Text>
            {`You correctly spotted `}
            <Text span fw="bold">{`${String(correctCount)} / ${String(totalRounds)}`}</Text>
            {" bits of slop"}
          </Text>
        </Stack>
      </Center>
    </Modal>
  );
}

export { GameOver };
