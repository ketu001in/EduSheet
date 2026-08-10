'use client';
import { useCallback, useState } from 'react';

// Shared score/streak/best-streak tracking for every Math Games arcade
// game -- session-only (like every other lab's Free Play sandbox), no
// persistence needed for a quick drill game. A small streak bonus (capped)
// rewards consecutive correct answers without letting a long streak
// trivialize the score.
export function useGameScore() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const recordAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => Math.max(b, next));
        setScore((sc) => sc + 10 + Math.min(s, 5) * 2);
        return next;
      });
    } else {
      setStreak(0);
    }
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setStreak(0);
  }, []);

  return { score, streak, best, recordAnswer, reset };
}
