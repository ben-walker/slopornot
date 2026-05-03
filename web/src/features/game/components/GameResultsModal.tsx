import { Card, Group, Modal, NumberFormatter, Stack, Text, Title } from "@mantine/core";
import type { Guess } from "src/features/game/types";
import { getTitle } from "src/features/game/utils";
import { useMemo } from "react";

interface GameResultsModalProps {
  averageCorrect: number;
  guesses: Guess[];
  isOpen: boolean;
  onClose: () => void;
  totalRounds: number;
}

function GameResultsModal({
  averageCorrect,
  guesses,
  isOpen,
  onClose,
  totalRounds,
}: GameResultsModalProps) {
  const correctCount = useMemo(() => (
    guesses.filter(guess => guess.isCorrect).length
  ), [guesses]);

  const title = useMemo(() => (
    getTitle(correctCount, totalRounds)
  ), [correctCount, totalRounds]);

  const resultCards = useMemo(() => [
    {
      content: `${String(correctCount)} / ${String(totalRounds)}`,
      label: "Today",
    },
    {
      content: <NumberFormatter decimalScale={0} suffix="%" value={averageCorrect * 100} />,
      label: "Average",
    },
  ], [averageCorrect, correctCount, totalRounds]);

  return (
    <Modal
      centered
      closeOnClickOutside
      closeOnEscape
      onClose={onClose}
      opened={isOpen}
      size="sm"
      withCloseButton={false}
    >
      <Stack gap="md">
        <Title order={3}>{title}</Title>
        <Group grow>
          {resultCards.map(({ content, label }) => (
            <Card withBorder padding="md" ta="center" key={label}>
              <Text size="xs" c="dimmed">{label}</Text>
              <Text size="xl" fw="bold">
                {content}
              </Text>
            </Card>
          ))}
        </Group>
      </Stack>
    </Modal>
  );
}

export { GameResultsModal };
