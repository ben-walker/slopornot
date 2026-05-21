import { Button, Card, CopyButton, Group, Modal, NumberFormatter, Stack, Text, Title } from "@mantine/core";
import { CheckIcon, ShareIcon } from "@phosphor-icons/react";
import type { Guess, HistoryEntry } from "src/features/game/types";
import { format, parse } from "date-fns";
import { LineChart } from "@mantine/charts";
import { getTitle } from "src/features/game/utils";
import { useMemo } from "react";

const DATE_KEY = "date" satisfies keyof HistoryEntry;
const ACCURACY_KEY = "accuracy" satisfies keyof HistoryEntry;
const COPY_BUTTON_TIMEOUT = 1500;
const ICON_SIZE = 16;

interface GameResultsModalProps {
  averageCorrect: number;
  guesses: Guess[];
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  totalRounds: number;
}

function GameResultsModal({
  averageCorrect,
  guesses,
  history,
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

  const shareText = useMemo(() => {
    const dots = guesses.map(guess => (guess.isCorrect ? "🔵" : "⚫")).join("");
    const today = format(new Date(), "MMM d, yyyy");

    return `slopornot • ${today} • ${String(correctCount)}/${String(totalRounds)}\n\n${dots}`;
  }, [correctCount, guesses, totalRounds]);

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
        <Title order={4}>{title}</Title>
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
        <CopyButton timeout={COPY_BUTTON_TIMEOUT} value={shareText}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "teal" : "blue"}
              fullWidth
              onClick={copy}
              rightSection={copied ? <CheckIcon size={ICON_SIZE} weight="bold" /> : <ShareIcon size={ICON_SIZE} weight="bold" />}
            >
              {copied ? "Copied to clipboard" : "Share"}
            </Button>
          )}
        </CopyButton>
        {history.length > 0 && (
          <Stack gap="xs">
            <Text size="md" fw="bold">Accuracy over time</Text>
            <LineChart
              curveType="monotone"
              data={history}
              dataKey={DATE_KEY}
              gradientStops={[
                { color: "correct", offset: 0 },
                { color: "incorrect", offset: 100 },
              ]}
              h={200}
              series={[{ name: ACCURACY_KEY, label: "Accuracy" }]}
              strokeWidth={5}
              type="gradient"
              valueFormatter={value => `${String(value)}%`}
              withDots
              withTooltip={false}
              xAxisProps={{
                tickFormatter: (date: string) => {
                  return format(parse(date, "yyyy-MM-dd", new Date()), "MMM d");
                },
              }}
              yAxisProps={{ domain: [0, 100] }}
            />
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}

export { GameResultsModal };
