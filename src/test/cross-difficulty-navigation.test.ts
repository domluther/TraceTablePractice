import { describe, it, expect } from 'vitest';
import { programs } from '@/lib/programs';
import type { Difficulty } from '@/lib/types';

// Test helper functions that simulate the navigation logic
function getDifficultyOrder(): Difficulty[] {
  return ["easy", "medium", "hard"];
}

function getNextDifficultyAndIndex(
  currentDiff: Difficulty,
  currentIdx: number
): { difficulty: Difficulty; index: number } | null {
  const difficulties = getDifficultyOrder();
  const currentProgramList = programs[currentDiff] || [];
  
  // If not at the end of current difficulty, move to next program in same difficulty
  if (currentIdx < currentProgramList.length - 1) {
    return { difficulty: currentDiff, index: currentIdx + 1 };
  }
  
  // At the end of current difficulty, try to move to next difficulty
  const currentDiffIndex = difficulties.indexOf(currentDiff);
  if (currentDiffIndex < difficulties.length - 1) {
    const nextDifficulty = difficulties[currentDiffIndex + 1];
    const nextProgramList = programs[nextDifficulty] || [];
    if (nextProgramList.length > 0) {
      return { difficulty: nextDifficulty, index: 0 };
    }
  }
  
  return null; // No next program available
}

function getPreviousDifficultyAndIndex(
  currentDiff: Difficulty,
  currentIdx: number
): { difficulty: Difficulty; index: number } | null {
  const difficulties = getDifficultyOrder();
  
  // If not at the beginning of current difficulty, move to previous program in same difficulty
  if (currentIdx > 0) {
    return { difficulty: currentDiff, index: currentIdx - 1 };
  }
  
  // At the beginning of current difficulty, try to move to previous difficulty
  const currentDiffIndex = difficulties.indexOf(currentDiff);
  if (currentDiffIndex > 0) {
    const prevDifficulty = difficulties[currentDiffIndex - 1];
    const prevProgramList = programs[prevDifficulty] || [];
    if (prevProgramList.length > 0) {
      return { difficulty: prevDifficulty, index: prevProgramList.length - 1 };
    }
  }
  
  return null; // No previous program available
}

describe('Cross-difficulty navigation', () => {
  describe('getNextDifficultyAndIndex', () => {
    it('should move to next program in same difficulty when not at end', () => {
      const result = getNextDifficultyAndIndex('easy', 0);
      expect(result).toEqual({ difficulty: 'easy', index: 1 });
    });

    it('should move to first program of next difficulty when at end of current difficulty', () => {
      const easyProgramsCount = programs.easy.length;
      const result = getNextDifficultyAndIndex('easy', easyProgramsCount - 1);
      expect(result).toEqual({ difficulty: 'medium', index: 0 });
    });

    it('should move from end of medium to first of hard', () => {
      const mediumProgramsCount = programs.medium.length;
      const result = getNextDifficultyAndIndex('medium', mediumProgramsCount - 1);
      expect(result).toEqual({ difficulty: 'hard', index: 0 });
    });

    it('should return null when at end of hard difficulty', () => {
      const hardProgramsCount = programs.hard.length;
      const result = getNextDifficultyAndIndex('hard', hardProgramsCount - 1);
      expect(result).toBeNull();
    });
  });

  describe('getPreviousDifficultyAndIndex', () => {
    it('should move to previous program in same difficulty when not at beginning', () => {
      const result = getPreviousDifficultyAndIndex('easy', 1);
      expect(result).toEqual({ difficulty: 'easy', index: 0 });
    });

    it('should return null when at beginning of easy difficulty', () => {
      const result = getPreviousDifficultyAndIndex('easy', 0);
      expect(result).toBeNull();
    });

    it('should move to last program of previous difficulty when at beginning of current difficulty', () => {
      const result = getPreviousDifficultyAndIndex('medium', 0);
      const easyProgramsCount = programs.easy.length;
      expect(result).toEqual({ difficulty: 'easy', index: easyProgramsCount - 1 });
    });

    it('should move from beginning of hard to last of medium', () => {
      const result = getPreviousDifficultyAndIndex('hard', 0);
      const mediumProgramsCount = programs.medium.length;
      expect(result).toEqual({ difficulty: 'medium', index: mediumProgramsCount - 1 });
    });
  });

  describe('Navigation availability', () => {
    it('should indicate no previous navigation available at very beginning', () => {
      const result = getPreviousDifficultyAndIndex('easy', 0);
      expect(result).toBeNull();
    });

    it('should indicate no next navigation available at very end', () => {
      const hardProgramsCount = programs.hard.length;
      const result = getNextDifficultyAndIndex('hard', hardProgramsCount - 1);
      expect(result).toBeNull();
    });

    it('should allow navigation in middle positions', () => {
      const nextResult = getNextDifficultyAndIndex('medium', 1);
      const prevResult = getPreviousDifficultyAndIndex('medium', 1);
      
      expect(nextResult).not.toBeNull();
      expect(prevResult).not.toBeNull();
    });
  });
});
