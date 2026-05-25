/**
 * FNV-1a hash: deterministically turns a string into a 32-bit number.
 */
const hashSeed = (str: string): number => {
  let hash = 2166136261;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

/**
 * Mulberry32: a tiny, fast 32-bit PRNG. Given the same seed, produces the same
 * sequence of floats in [0, 1).
 */
const createMulberry32 = (seed: number): () => number => {
  let state = seed;

  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= (t + Math.imul(t ^ (t >>> 7), 61 | t));

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export {
  hashSeed,
  createMulberry32,
};
