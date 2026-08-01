export type FlashcardState = {
  currentIndex: number;
  total: number;
};

export function createInitialState(total: number): FlashcardState {
  return { currentIndex: 0, total };
}

export function getQuestionNumber(state: FlashcardState): number {
  return state.currentIndex + 1;
}

export function getProgressLabel(state: FlashcardState): string {
  return `${getQuestionNumber(state)} / ${state.total}`;
}

export function canGoNext(state: FlashcardState): boolean {
  return state.currentIndex < state.total - 1;
}

export function canGoPrev(state: FlashcardState): boolean {
  return state.currentIndex > 0;
}

export function goNext(state: FlashcardState): FlashcardState {
  if (!canGoNext(state)) return state;
  return { ...state, currentIndex: state.currentIndex + 1 };
}

export function goPrev(state: FlashcardState): FlashcardState {
  if (!canGoPrev(state)) return state;
  return { ...state, currentIndex: state.currentIndex - 1 };
}

export function goToIndex(state: FlashcardState, index: number): FlashcardState {
  if (index < 0 || index >= state.total) return state;
  return { ...state, currentIndex: index };
}

export function shuffleIndices(total: number, random: () => number = Math.random): number[] {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function getQuestionAt<T>(items: readonly T[], index: number): T | undefined {
  if (index < 0 || index >= items.length) return undefined;
  return items[index];
}

export function getActiveQuestionIndex(order: readonly number[], state: FlashcardState): number {
  return order[state.currentIndex] ?? state.currentIndex;
}

export function getQuestionLabel(state: FlashcardState): string {
  return `Pertanyaan #${getQuestionNumber(state)}`;
}

export function applyShuffle(
  total: number,
  random: () => number = Math.random,
): { state: FlashcardState; order: number[] } {
  return {
    state: createInitialState(total),
    order: shuffleIndices(total, random),
  };
}

export function shuffleAndAdvance(
  state: FlashcardState,
  random: () => number = Math.random,
): { state: FlashcardState; order: number[] } {
  const order = shuffleIndices(state.total, random);
  const nextState = canGoNext(state) ? goNext(state) : createInitialState(state.total);
  return { state: nextState, order };
}
