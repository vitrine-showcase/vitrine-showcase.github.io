export type Assembly = 'QC' | 'FED';

export type SalientObject = {
  label: string;
  score: number; // 0–1, relative weight
};

export type PartyIntervention = {
  party: string;      // abbreviation: CAQ, PLQ, LPC, CPC…
  fullName: string;
  interventions: number;
  score: number;      // 0–1, relative to the most active party
};

export type ParoleAssembly = {
  assemblyId: Assembly;
  chambre: string;
  sessionDate: string;
  sessionLabel: string;
  nextSessionLabel: string;
  title: string;       // main salient object/topic — computed by refiner
  score: number;       // absolute_normalized_index (0–1)
  prevScore: number;
  velocity: number;    // % change vs previous session
  objects: SalientObject[];
  monitoredParties: string[];
  partyInterventions: PartyIntervention[];
};

export type ParoleEnChambrePayload = {
  generatedAt: string;
  assemblies: { QC: ParoleAssembly; FED: ParoleAssembly };
};
