import { Group, ScrollArea, Stack, Text, ThemeIcon } from "@mantine/core";
import { LockIcon, TrophyIcon } from "@phosphor-icons/react";
import { AWARD_ICON_SIZE } from "src/awards/constants";
import type { AwardWithStatus } from "src/awards/types";

const MAX_HEIGHT = 360;

interface AwardsListProps {
  awards: AwardWithStatus[];
}

function AwardsList({ awards }: AwardsListProps) {
  return (
    <Stack gap="xs">
      <Text fw="bolder" size="lg">Awards</Text>
      <ScrollArea.Autosize mah={MAX_HEIGHT} offsetScrollbars="y" type="auto">
        <Stack gap="md">
          {awards.map(award => (
            <Group
              align="center"
              gap="sm"
              key={award.id}
              wrap="nowrap"
            >
              <ThemeIcon
                color={award.isUnlocked ? "correct" : "gray"}
                size="lg"
              >
                {award.isUnlocked ? <TrophyIcon size={AWARD_ICON_SIZE} /> : <LockIcon size={AWARD_ICON_SIZE} />}
              </ThemeIcon>
              <Stack gap={2}>
                <Text fw="bold" size="sm">{award.title}</Text>
                <Text c="dimmed" size="sm">{award.description}</Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </Stack>
  );
}

export { AwardsList };
