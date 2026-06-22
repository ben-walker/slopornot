import { AWARD_IDS, type Award } from "./types";

const AWARDS: Award[] = [
  {
    id: AWARD_IDS.shareResults,
    title: "Spread the slop",
    description: "Share your results",
  },
  {
    id: AWARD_IDS.perfectSet,
    title: "Perfect Days dir. Wim Wenders",
    description: "Get every guess right in a day",
  },
];

const STORAGE_KEY_AWARDS = "awards";

export {
  AWARDS,
  STORAGE_KEY_AWARDS,
};
