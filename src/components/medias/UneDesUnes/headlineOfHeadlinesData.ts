export type SalientObject = {
  label: string;
  score: number; // 0–1, relative weight — drives bar width
}

export type HotHeadline = {
  source: string;
  title: string;
  url: string;
  time: string;
}

export type HeadlineOfHeadlines = {
  countryId: 'QC' | 'CA';
  dateUtc: string;
  timeIntervalUtc: string;
  mainIssue: string;
  mainIssueLabelFr: string;
  mainIssueLabelEn: string;
  title: string;           // computed by aws-refiners from salient objects
  score: number;           // absolute_normalized_index (0–1)
  prevScore: number;
  velocity: number;        // % change vs previous snapshot
  objects: SalientObject[];
  monitoredSources: string[]; // all sources tracked (covering + not covering)
  headlines: HotHeadline[];   // subset: sources that cover this issue
  snapshotLabel: string;
  nextLabel: string;
}

export type HeadlineOfHeadlinesPayload = {
  generatedAt: string;
  countries: {
    QC: HeadlineOfHeadlines;
    CA: HeadlineOfHeadlines;
  };
}
