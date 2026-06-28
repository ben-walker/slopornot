const AWARD_IDS = {
  streak1: "streak-1",
  streak2: "streak-2",
  streak7: "streak-7",
  streak30: "streak-30",
  streak365: "streak-365",
  shareResults: "share-results",
  perfectSet: "perfect-set",
  failedSet: "failed-set",
  symmetric: "symmetric",
  hatTrick: "hat-trick",
} as const;

type AwardId = (typeof AWARD_IDS)[keyof typeof AWARD_IDS];

interface BaseAward {
  id: AwardId;
  title: string;
  description: string;
}

interface StreakAward extends BaseAward {
  kind: "streak";
  threshold: number;
}

interface ActionAward extends BaseAward {
  kind: "action";
}

type Award = StreakAward | ActionAward;

interface UnlockedAward {
  unlockedAt: string;
}

type UnlockedAwards = Partial<Record<AwardId, UnlockedAward>>;

type AwardWithStatus = Award & (
  | ({ isUnlocked: true } & UnlockedAward)
  | { isUnlocked: false }
);

export {
  AWARD_IDS,
};

export type {
  Award,
  AwardId,
  AwardWithStatus,
  UnlockedAward,
  UnlockedAwards,
};
