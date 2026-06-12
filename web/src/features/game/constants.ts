import type { PerformanceTier } from "./types";

const STORAGE_KEY_GAME = "games";

const ROUNDS_PER_ROW = 5;

const ANTICIPATION_DELAY_MS = 1000;

const REVEAL_DELAY_MS = 2000;

const titleBuckets: Record<PerformanceTier, string[]> = {
  perfect: ["The slop identifier has logged on"],
  great: ["This baby was born to slop, eats it up"],
  good: ["A little better than the average slopper"],
  ok: ["New slopper, please be patient"],
  poor: ["A journey of a thousand guesses starts with a single slop"],
  terrible: ["Drowning in the slop"],
};

export {
  ANTICIPATION_DELAY_MS,
  REVEAL_DELAY_MS,
  ROUNDS_PER_ROW,
  STORAGE_KEY_GAME,
  titleBuckets,
};
