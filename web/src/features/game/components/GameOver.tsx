import { Center, Modal, Stack, Text } from "@mantine/core";
import { useEffect, useMemo } from "react";
import type { Guess } from "src/features/game/types";
import { getTitle } from "src/features/game/utils";
import { useDisclosure } from "@mantine/hooks";

import { useTimeUntilMidnight } from "src/hooks/useTimeUntilMidnight";

interface GameOverProps {
  averageCorrect: number;
  guesses: Guess[];
  isOpen: boolean;
  totalRounds: number;
}

function GameOver({
  averageCorrect,
  guesses,
  isOpen,
  totalRounds,
}: GameOverProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const timeUntilMidnight = useTimeUntilMidnight();

  useEffect(() => {
    if (isOpen) {
      open();
    }
  }, [isOpen, open]);

  const correctCount = useMemo(() => (
    guesses.filter(guess => guess.isCorrect).length
  ), [guesses]);

  const title = useMemo(() => (
    getTitle(correctCount, totalRounds)
  ), [correctCount, totalRounds]);

  return (
    <Modal
      centered
      closeOnClickOutside
      closeOnEscape
      onClose={close}
      opened={opened}
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
          <Text fw="bold">{title}</Text>
          <Text>
            {`You correctly spotted `}
            <Text span fw="bold">{`${String(correctCount)} / ${String(totalRounds)}`}</Text>
            {" bits of slop"}
          </Text>
          <Text>
            {`Back in ${timeUntilMidnight}`}
          </Text>
        </Stack>
      </Center>
    </Modal>
  );
}

export { GameOver };
