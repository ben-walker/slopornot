import { Center, Modal, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import type { Guess } from "src/features/game/types";
import { getTitle } from "src/features/game/utils";
import { useDisclosure } from "@mantine/hooks";
import { useIsMobile } from "src/hooks/useIsMobile";

import { useTimeUntilMidnight } from "src/hooks/useTimeUntilMidnight";

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
  const [opened, { open, close }] = useDisclosure(false);

  const timeUntilMidnight = useTimeUntilMidnight();
  const isMobile = useIsMobile();

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
      fullScreen={isMobile}
      onClose={close}
      opened={opened}
      size="auto"
      styles={{
        body: {
          height: "100%",
        },
      }}
      withCloseButton
    >
      <Center h="100%">
        <Stack align="flex-start">
          <Title order={3}>{title}</Title>
          <Text>
            {`You correctly spotted `}
            <Text span fw="bold">{`${String(correctCount)} / ${String(totalRounds)}`}</Text>
            {" bits of slop"}
          </Text>
          <Text>
            {`Back soon ${timeUntilMidnight}`}
          </Text>
        </Stack>
      </Center>
    </Modal>
  );
}

export { GameOver };
