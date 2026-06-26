import { AWARD_IDS, type Award } from "./types";

const AWARDS: Award[] = [
  {
    id: AWARD_IDS.streak1,
    kind: "streak",
    threshold: 1,
    title: "An intro to slop",
    description: "Complete a game",
  },
  {
    id: AWARD_IDS.shareResults,
    kind: "action",
    title: "Spread the slop",
    description: "Share your results",
  },
  {
    id: AWARD_IDS.perfectSet,
    kind: "action",
    title: "Perfect Days dir. Wim Wenders",
    description: "Get every guess right",
  },
  {
    id: AWARD_IDS.failedSet,
    kind: "action",
    title: "All blunders",
    description: "Get every guess wrong",
  },
  {
    id: AWARD_IDS.symmetric,
    kind: "action",
    title: "Rorschlop",
    description: "Get symmetrical results",
  },
  {
    id: AWARD_IDS.streak2,
    kind: "streak",
    threshold: 2,
    title: "One Slop After Another",
    description: "2 day streak",
  },
  {
    id: AWARD_IDS.streak7,
    kind: "streak",
    threshold: 7,
    title: "A hard week of slop",
    description: "7 day streak",
  },
  {
    id: AWARD_IDS.streak30,
    kind: "streak",
    threshold: 30,
    title: "Sloptember",
    description: "30 day streak",
  },
  {
    id: AWARD_IDS.streak365,
    kind: "streak",
    threshold: 365,
    title: "The Year of Magical Slopping",
    description: "365 day streak",
  },
];

const STORAGE_KEY_AWARDS = "awards";

export {
  AWARDS,
  STORAGE_KEY_AWARDS,
};
