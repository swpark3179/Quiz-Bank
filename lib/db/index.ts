export { getDatabase, closeDatabase } from './schema';
export {
  createSession,
  saveAnswer,
  updateSessionCorrect,
  fetchSessions,
  fetchAllSessions,
  fetchSession,
  fetchAnswers,
  fetchWrongAnswers,
  deleteSession,
  clearCategorySessions,
} from './sessions';
export type { SessionRow, AnswerRow } from './sessions';
export { fetchSessionStats, fetchCategorySummary, fetchQuestionStats } from './stats';
export type { SessionStat, CategorySummary, QuestionStat } from './stats';
