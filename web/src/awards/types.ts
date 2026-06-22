const AWARD_IDS = {
  shareResults: "share-results",
  perfectSet: "perfect-set",
} as const;

type AwardId = (typeof AWARD_IDS)[keyof typeof AWARD_IDS];

interface Award {
  id: AwardId;
  title: string;
  description: string;
}

interface UnlockedAward {
  unlockedAt: string;
}

type UnlockedAwards = Partial<Record<AwardId, UnlockedAward>>;

// TODO: add AwardWithStatus = Award & { isUnlocked: boolean; unlockedAt?: string }
// so useAwards can hand the menu a pre-merged list and the menu never touches
// the raw unlocked map. Revisit when the award list grows past one (and re-evaluate shape)

export {
  AWARD_IDS,
};

export type {
  Award,
  AwardId,
  UnlockedAward,
  UnlockedAwards,
};
