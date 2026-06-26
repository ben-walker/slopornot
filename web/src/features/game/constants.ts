import type { GuessPhase, PerformanceTier } from "./types";

const STORAGE_KEY_GAME = "games";

const ROUNDS_PER_ROW = 5;

const TOTAL_ROUNDS = 10;

const PHASE_DURATIONS_MS: Record<Exclude<GuessPhase, "idle">, number> = {
  pending: 1000,
  revealed: 1800,
};

const titleBuckets: Record<PerformanceTier, string[]> = {
  perfect: ["The slop identifier has logged on"],
  great: ["This baby was born to slop, eats it up"],
  good: ["A little better than the average slopper"],
  ok: ["New slopper, please be patient"],
  poor: ["A journey of a thousand guesses starts with a single slop"],
  terrible: ["Drowning in the slop"],
};

export {
  PHASE_DURATIONS_MS,
  ROUNDS_PER_ROW,
  TOTAL_ROUNDS,
  STORAGE_KEY_GAME,
  titleBuckets,
};
