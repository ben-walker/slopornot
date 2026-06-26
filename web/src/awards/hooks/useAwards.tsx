import { AWARDS, STORAGE_KEY_AWARDS } from "src/awards/constants";
import type { AwardId, AwardWithStatus, UnlockedAwards } from "src/awards/types";
import { useCallback, useMemo } from "react";
import { AwardIcon } from "src/awards/AwardIcon";
import { ThemeIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";

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
      color: "correct",
      icon: (
        <ThemeIcon color="correct" size="lg">
          <AwardIcon />
        </ThemeIcon>
      ),
      message: award.description,
      styles: {
        icon: {
          backgroundColor: "transparent",
          height: "auto",
          minWidth: 0,
          width: "auto",
        },
      },
      title: award.title,
    });

    setUnlockedAwards(prev => ({
      ...prev,
      [id]: { unlockedAt: new Date().toISOString() },
    }));
  }, [setUnlockedAwards, unlockedAwards]);

  const unlockStreakAwards = useCallback((streak: number) => {
    AWARDS.forEach((award) => {
      if (award.kind === "streak" && streak >= award.threshold) {
        unlockAward(award.id);
      }
    });
  }, [unlockAward]);

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
    unlockStreakAwards,
  };
}

export { useAwards };
