export interface UserBehavior {
  id: string;
  user_id: string;
  topic_id: string;
  time_spent_seconds: number;
  questions_attempted: number;
  questions_correct: number;
  performance_score: number;
  last_activity_at: Date | string;
}

export interface Recommendation {
  topic: string;
  reason: string;
  difficulty_suggestion: string;
  priority_score: number;
}

export interface LearningStats {
  total_worksheets: number;
  topics_covered: number;
  average_performance: number;
  streak_days: number;
  time_spent_total: number;
}
