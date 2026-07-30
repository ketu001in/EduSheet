import { supabaseAdmin } from '../lib/supabase';

export const trackActivity = async (userId: string, topicId: string, data: { score?: number, time_spent?: number }) => {
  // Fetch existing
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('user_behavior')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  // Note: performance_score is a generated column (questions_correct / questions_attempted),
  // so we track raw counts rather than an average score directly.
  const questionsAttempted = (existing?.questions_attempted || 0) + 1;
  const questionsCorrect = (existing?.questions_correct || 0) + (data.score !== undefined && data.score >= 50 ? 1 : 0);
  const timeSpentSeconds = (existing?.time_spent_seconds || 0) + (data.time_spent || 0);

  const { error } = await supabaseAdmin
    .from('user_behavior')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      questions_attempted: questionsAttempted,
      questions_correct: questionsCorrect,
      time_spent_seconds: timeSpentSeconds,
      last_activity_at: new Date().toISOString(),
    }, { onConflict: 'user_id,topic_id' });

  if (error) {
    throw new Error(`Failed to track activity: ${error.message}`);
  }
};

export const getStats = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('user_behavior')
    .select('*, topics(title, chapter_id, chapters(title, subject_id, subjects(name)))')
    .eq('user_id', userId);

  if (error) throw error;

  const totalTopics = data.length;
  const avgScore = data.reduce((acc, curr) => acc + curr.performance_score, 0) / (totalTopics || 1);
  const strongTopics = data.filter(d => d.performance_score >= 80).length;
  const weakTopics = data.filter(d => d.performance_score < 60).length;

  return { totalTopics, avgScore, strongTopics, weakTopics, details: data };
};

export const getRecommendations = async (userId: string) => {
  const { data: behaviors, error } = await supabaseAdmin
    .from('user_behavior')
    .select('topic_id, performance_score, last_activity_at, topics(title)')
    .eq('user_id', userId);

  if (error) throw error;

  const recommendations = [];

  // Weak topics (score < 60%)
  const weak = behaviors.filter(b => b.performance_score < 60);
  for (const w of weak) {
    recommendations.push({
      topic_id: w.topic_id,
      topic_name: (w.topics as any)?.title,
      reason: 'Needs improvement (Low score)',
      priority: 'High'
    });
  }

  // Stale topics (not practiced in 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const stale = behaviors.filter(b => new Date(b.last_activity_at) < fourteenDaysAgo);
  for (const s of stale) {
    recommendations.push({
      topic_id: s.topic_id,
      topic_name: (s.topics as any)?.title,
      reason: 'Revision recommended (Not practiced recently)',
      priority: 'Medium'
    });
  }

  // TODO: Find untouched topics in current class

  return recommendations.slice(0, 10);
};
