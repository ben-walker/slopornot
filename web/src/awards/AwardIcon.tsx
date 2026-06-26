import { LockIcon, TrophyIcon } from "@phosphor-icons/react";

const AWARD_ICON_SIZE = 20;

interface AwardIconProps {
  isLocked?: boolean;
}

function AwardIcon({ isLocked = false }: AwardIconProps) {
  const Icon = isLocked ? LockIcon : TrophyIcon;

  return <Icon size={AWARD_ICON_SIZE} />;
}

export { AwardIcon };
