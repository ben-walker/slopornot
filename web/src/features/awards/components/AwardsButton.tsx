import { ActionIcon } from "@mantine/core";
import { TrophyIcon } from "@phosphor-icons/react";

const ICON_SIZE = 20;

function AwardsButton() {
  return (
    <ActionIcon aria-label="View awards" size="lg" variant="default">
      <TrophyIcon size={ICON_SIZE} />
    </ActionIcon>
  );
}

export { AwardsButton };
