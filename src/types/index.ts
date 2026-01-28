export interface Auftrag {
  id: string;
  auftragsnummer: string;
  kundenname: string;
  warengruppe: string;
  profiltyp: string;
  profilfarbe: string;
  alufarbe: string | null;
  verkaeufer: string;
  einheiten: number;
  stueckStaebe: number;
  stueckRahmenAlu: number;
  stueckSchwellen: number;
  zuschnittDatum: string | null;
  abholungDatum: string | null;
  abteilung: 'Standard' | 'Sonderbau' | null;
  kalenderwoche: number | null;
  status: 'ungeplant' | 'geplant';
}

export interface Kapazitaet {
  kw: number;
  standard: { tag: number; max: number; min: number };
  sonderbau: { tag: number; max: number; min: number };
}
