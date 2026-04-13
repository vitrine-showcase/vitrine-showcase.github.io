export type MediaTreemapHeadline = {
  title: string;
  source: string;
  time: string;
  url?: string;
}

export type MediaTreemapIssue = {
  key: string;
  tag: string;
  label: string;
  color: string;
  score: number;
  prevScore: number;
  velocity: number;
  headlines: MediaTreemapHeadline[];
}

export type MediaTreemapSnapshot = {
  label: string;
  scores: Record<string, number> | null;
}

export type MediaTreemapPeriod = 'day' | 'week' | 'month'

export type MediaTreemapPeriodData = {
  period: MediaTreemapPeriod;
  label: string;
  pass?: string | null;
  snapshotLabel: string;
  nextLabel: string;
  issues: MediaTreemapIssue[];
  history: MediaTreemapSnapshot[];
}

export type MediaTreemapPayload = {
  generatedAt: string;
  source: {
    env: string;
    table: string;
    language: string;
    country: string;
  };
  periods: Record<MediaTreemapPeriod, MediaTreemapPeriodData>;
}
