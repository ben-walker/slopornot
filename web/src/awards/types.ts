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
