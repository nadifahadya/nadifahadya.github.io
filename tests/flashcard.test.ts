import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getQuestionNumber,
  getProgressLabel,
  canGoNext,
  canGoPrev,
  goNext,
  goPrev,
  goToIndex,
  shuffleIndices,
  getQuestionAt,
  getQuestionLabel,
  applyShuffle,
} from '../src/lib/flashcard';
import { QUESTIONS, TOTAL_QUESTIONS } from '../src/data/questions';

describe('flashcard navigation', () => {
  it('starts at question 1', () => {
    const state = createInitialState(TOTAL_QUESTIONS);
    expect(getQuestionNumber(state)).toBe(1);
    expect(getProgressLabel(state)).toBe('1 / 50');
  });

  it('navigates forward and backward within bounds', () => {
    let state = createInitialState(5);

    expect(canGoPrev(state)).toBe(false);
    expect(canGoNext(state)).toBe(true);

    state = goNext(state);
    expect(getQuestionNumber(state)).toBe(2);

    state = goPrev(state);
    expect(getQuestionNumber(state)).toBe(1);

    state = goToIndex(state, 4);
    expect(getQuestionNumber(state)).toBe(5);
    expect(canGoNext(state)).toBe(false);

    state = goNext(state);
    expect(getQuestionNumber(state)).toBe(5);
  });

  it('ignores invalid index changes', () => {
    const state = createInitialState(3);
    expect(goToIndex(state, -1)).toEqual(state);
    expect(goToIndex(state, 99)).toEqual(state);
  });
});

describe('shuffleIndices', () => {
  it('returns a permutation of all indices', () => {
    const result = shuffleIndices(5, () => 0.5);
    expect(result).toHaveLength(5);
    expect(result.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('produces deterministic output with fixed random', () => {
    const random = () => 0;
    expect(shuffleIndices(3, random)).toEqual([1, 2, 0]);
  });
});

describe('applyShuffle', () => {
  it('resets progress counter to the first card', () => {
    let state = createInitialState(5);
    state = goToIndex(state, 3);

    const { state: shuffledState, order } = applyShuffle(5, () => 0.5);

    expect(getProgressLabel(shuffledState)).toBe('1 / 5');
    expect(getQuestionLabel(shuffledState)).toBe('Pertanyaan #1');
    expect(order).toHaveLength(5);
  });
});

describe('questions data', () => {
  it('contains exactly 50 questions', () => {
    expect(TOTAL_QUESTIONS).toBe(50);
    expect(QUESTIONS).toHaveLength(50);
  });

  it('returns question by index safely', () => {
    expect(getQuestionAt(QUESTIONS, 0)).toBe('Kalau hidupmu jadi film, judulnya apa?');
    expect(getQuestionAt(QUESTIONS, 49)).toContain('viral');
    expect(getQuestionAt(QUESTIONS, 50)).toBeUndefined();
  });
});
