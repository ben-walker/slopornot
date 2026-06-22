import { AWARDS, STORAGE_KEY_AWARDS } from "src/awards/constants";
import type { AwardId, AwardWithStatus, UnlockedAwards } from "src/awards/types";
import { useCallback, useMemo } from "react";
import { TrophyIcon } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";

const ICON_SIZE = 22;

function useAwards() {
  const [unlockedAwards, setUnlockedAwards] = useLocalStorage<UnlockedAwards>({
    defaultValue: {},
    // Read synchronously so the menu renders correct lock state on first paint.
    getInitialValueInEffect: false,
    key: STORAGE_KEY_AWARDS,
  });

  const unlockAward = useCallback((id: AwardId) => {
    if (unlockedAwards[id]) {
      return;
    }

    const award = AWARDS.find(award => award.id === id);

    if (!award) {
      return;
    }

    notifications.show({
      color: "yellow",
      icon: <TrophyIcon size={ICON_SIZE} />,
      message: award.description,
      title: award.title,
    });

    setUnlockedAwards(prev => ({
      ...prev,
      [id]: { unlockedAt: new Date().toISOString() },
    }));
  }, [setUnlockedAwards, unlockedAwards]);

  const awards = useMemo<AwardWithStatus[]>(() => (
    AWARDS.map((award) => {
      const unlockedAward = unlockedAwards[award.id];

      return unlockedAward
        ? { ...award, isUnlocked: true, ...unlockedAward }
        : { ...award, isUnlocked: false };
    })
  ), [unlockedAwards]);

  return {
    awards,
    unlockAward,
  };
}

export { useAwards };
