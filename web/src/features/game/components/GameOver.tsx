import { Card, Group, Modal, NumberFormatter, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import type { Guess } from "src/features/game/types";
import { getTitle } from "src/features/game/utils";
import { useDisclosure } from "@mantine/hooks";

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
      onClose={close}
      opened={opened}
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

export { GameOver };
