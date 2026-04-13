import { shuffleQuiz } from '../../../lib/quiz/shuffler';
import type { QuizQuestion } from '../../../lib/parser/quizParser';

describe('shuffler', () => {
  const mockQuestions: QuizQuestion[] = [
    {
      question: 'Question 1',
      choices: [
        { index: 0, label: '① Choice A', description: 'Desc A' },
        { index: 1, label: '② Choice B', description: 'Desc B' },
        { index: 2, label: '③ Choice C', description: 'Desc C' },
        { index: 3, label: '④ Choice D', description: 'Desc D' }
      ],
      answer: 0,
      id: 1,
      sourceFileId: 'file1',
      explanation: 'Explanation 1'
    },
    {
      question: 'Question 2',
      choices: [
        { index: 0, label: '① Choice A', description: 'Desc A' },
        { index: 1, label: '② Choice B', description: 'Desc B' },
        { index: 2, label: '③ Choice C', description: 'Desc C' },
        { index: 3, label: '④ Choice D', description: 'Desc D' }
      ],
      answer: 1,
      id: 2,
      sourceFileId: 'file1',
      explanation: 'Explanation 2'
    }
  ];

  describe('shuffleQuiz', () => {
    it('should return all elements when count is undefined', () => {
      const result = shuffleQuiz(mockQuestions);
      expect(result.length).toBe(mockQuestions.length);
    });

    it('should return the specified number of elements when count is less than array length', () => {
      const result = shuffleQuiz(mockQuestions, 1);
      expect(result.length).toBe(1);
    });

    it('should return the array length number of elements when count is greater than array length', () => {
      // Missing edge case test: shuffleQuiz with count greater than array length
      const result = shuffleQuiz(mockQuestions, 5);
      expect(result.length).toBe(2);
    });

    it('should shuffle the questions array', () => {
      // Since it's random, we can just ensure it doesn't crash and returns the correct items
      const result = shuffleQuiz(mockQuestions);
      expect(result.length).toBe(2);

      const originalIds = mockQuestions.map(q => q.id);
      const resultIds = result.map(r => r.original.id);

      expect(resultIds.every(id => originalIds.includes(id))).toBe(true);
    });

    it('should correctly remap the answer index after shuffling choices', () => {
      const result = shuffleQuiz(mockQuestions);

      for (const shuffledItem of result) {
        const originalQuestion = shuffledItem.original;
        const originalAnswerIndex = originalQuestion.answer;

        // Find the choice object in the shuffled array that corresponds to the original answer
        const correctlyMappedChoice = shuffledItem.shuffledChoices[shuffledItem.mappedAnswer];

        expect(correctlyMappedChoice.index).toBe(originalAnswerIndex);
      }
    });
  });
});
