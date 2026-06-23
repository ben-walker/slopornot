import { ActionIcon, Popover } from "@mantine/core";
import { AWARD_ICON_SIZE } from "src/awards/constants";
import { AwardsList } from "./AwardsList";
import { TrophyIcon } from "@phosphor-icons/react";
import { useAwards } from "src/awards/hooks/useAwards";

const DROPDOWN_WIDTH = 320;

function AwardsButton() {
  const { awards } = useAwards();

  return (
    <Popover position="bottom-end" shadow="md" width={DROPDOWN_WIDTH}>
      <Popover.Target>
        <ActionIcon aria-label="View awards" size="lg" variant="default">
          <TrophyIcon size={AWARD_ICON_SIZE} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <AwardsList awards={awards} />
      </Popover.Dropdown>
    </Popover>
  );
}

export { AwardsButton };
