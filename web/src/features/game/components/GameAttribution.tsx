import { Anchor, Code, Group, Stack, Text } from "@mantine/core";
import type { Attribution, GuessPhase } from "src/features/game/types";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { GlassPaper } from "src/components/GlassPaper";
import classes from "./GameAttribution.module.css";

const UTM_SOURCE = "slopornot";
const UTM_MEDIUM = "referral";
const ICON_SIZE = 20;

const withUtm = (url: string) => {
  const utmUrl = new URL(url);

  utmUrl.searchParams.set("utm_source", UTM_SOURCE);
  utmUrl.searchParams.set("utm_medium", UTM_MEDIUM);

  return utmUrl.toString();
};

const UNSPLASH_HOME = withUtm("https://unsplash.com/");

interface GameAttributionProps {
  attribution: Attribution;
  isCorrect: boolean;
  phase?: GuessPhase;
}

function GameAttribution({
  attribution,
  isCorrect,
  phase,
}: GameAttributionProps) {
  return (
    <GlassPaper
      className={classes.paper}
      data-phase={phase}
      p="sm"
      radius="md"
      shadow="xl"
      withBorder
    >
      <Stack gap="xs" c="white">
        <Group gap="xs">
          <Text fw="bold">{attribution.kind === "ai" ? "Slop" : "Real"}</Text>
          {isCorrect
            ? <CheckIcon size={ICON_SIZE} weight="bold" />
            : <XIcon size={ICON_SIZE} weight="bold" />}
        </Group>
        {attribution.kind === "ai"
          ? (
              <Text size="sm">
                {`Generated with `}
                <Code color="gray">{attribution.model}</Code>
              </Text>
            )
          : (
              <Text size="sm">
                {`Photo by `}
                <Anchor href={withUtm(attribution.authorUrl)} target="_blank" rel="noopener noreferrer">
                  {attribution.authorName}
                </Anchor>
                {` on `}
                <Anchor href={UNSPLASH_HOME} target="_blank" rel="noopener noreferrer">
                  Unsplash
                </Anchor>
              </Text>
            )}
      </Stack>
    </GlassPaper>
  );
}

export { GameAttribution };
