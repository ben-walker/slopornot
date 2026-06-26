import { Button, Card, CopyButton, Group, Modal, NumberFormatter, Stack, Text, Title } from "@mantine/core";
import { CheckIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import type { Guess, HistoryEntry } from "src/features/game/types";
import { chunkIntoRows, getTitle } from "src/features/game/utils";
import { format, parseISO } from "date-fns";
import { AWARD_IDS } from "src/awards/types";
import { LineChart } from "@mantine/charts";
import classes from "./GameResultsModal.module.css";
import { useAwards } from "src/awards/hooks/useAwards";
import { useMemo } from "react";

const DATE_KEY = "date" satisfies keyof HistoryEntry;
const ACCURACY_KEY = "accuracy" satisfies keyof HistoryEntry;
const COPY_BUTTON_TIMEOUT = 1500;
const ICON_SIZE = 16;
const Y_AXIS_WIDTH = 50;
const CHART_HEIGHT = 200;

interface GameResultsModalProps {
  averageCorrect: number;
  guesses: Guess[];
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  totalRounds: number;
}

function GameResultsModal({
  averageCorrect,
  guesses,
  history,
  isOpen,
  onClose,
  streak,
  totalRounds,
}: GameResultsModalProps) {
  const { unlockAward } = useAwards();

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
    {
      content: streak,
      label: "Streak",
    },
  ], [averageCorrect, correctCount, streak, totalRounds]);

  const shareText = useMemo(() => {
    const dots = guesses.map(guess => (guess.isCorrect ? "🔵" : "⚫"));
    const dotRows = chunkIntoRows(dots)
      .map(row => row.join(""))
      .join("\n");
    const today = format(new Date(), "MMM d, yyyy");

    return `slopornot.sh • ${today} • ${String(correctCount)}/${String(totalRounds)}\n\n${dotRows}`;
  }, [correctCount, guesses, totalRounds]);

  return (
    <Modal
      centered
      className={classes.root}
      closeOnClickOutside
      closeOnEscape
      onClose={onClose}
      opened={isOpen}
      size="sm"
      withCloseButton={false}
    >
      <Stack gap="md">
        <Title className={classes.title} data-autofocus order={4} tabIndex={-1}>{title}</Title>
        <Group grow>
          {resultCards.map(({ content, label }) => (
            <Card withBorder padding="sm" ta="center" key={label}>
              <Text size="xs" c="dimmed">{label}</Text>
              <Text size="xl" fw="bold">
                {content}
              </Text>
            </Card>
          ))}
        </Group>
        {history.length > 0 && (
          <Stack gap="xs">
            <Text size="md" fw="bold">Accuracy over time</Text>
            <LineChart
              curveType="monotone"
              data={history}
              dataKey={DATE_KEY}
              h={CHART_HEIGHT}
              series={[{ name: ACCURACY_KEY, label: "Accuracy", color: "correct" }]}
              valueFormatter={value => `${String(value)}%`}
              withDots
              withTooltip={false}
              xAxisProps={{
                tickFormatter: (date: string) => {
                  return format(parseISO(date), "MMM d");
                },
              }}
              yAxisProps={{ domain: [0, 100], width: Y_AXIS_WIDTH }}
            />
          </Stack>
        )}
        <CopyButton timeout={COPY_BUTTON_TIMEOUT} value={shareText}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "teal" : "blue"}
              fullWidth
              onClick={() => {
                copy();
                unlockAward(AWARD_IDS.shareResults);
              }}
              rightSection={copied ? <CheckIcon size={ICON_SIZE} weight="bold" /> : <ShareNetworkIcon size={ICON_SIZE} weight="bold" />}
            >
              {copied ? "Copied to clipboard" : "Share"}
            </Button>
          )}
        </CopyButton>
      </Stack>
    </Modal>
  );
}

export { GameResultsModal };
