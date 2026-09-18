export interface MeetingMetadata {
  type?: string;
  source?: string;
  summary?: string;
  painPoints?: string[];
  actionItems?: string[];
  nextStep?: string;
  sentiment?: 'positive' | 'neutral' | 'concerned';
  topics?: string[];
}

export function parseMeetingMetadata(metadata: string | null): MeetingMetadata {
  if (!metadata) return {};
  try {
    const parsed = JSON.parse(metadata);
    return {
      type: parsed.type || '',
      source: parsed.source || '',
      summary: parsed.summary || '',
      painPoints: Array.isArray(parsed.painPoints) ? parsed.painPoints : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      nextStep: parsed.nextStep || '',
      sentiment: ['positive', 'neutral', 'concerned'].includes(parsed.sentiment) ? parsed.sentiment : 'neutral',
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
    };
  } catch {
    return {};
  }
}

export function getSentimentColor(sentiment: string): string {
  const colors: Record<string, string> = {
    positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    concerned: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[sentiment] || colors.neutral;
}