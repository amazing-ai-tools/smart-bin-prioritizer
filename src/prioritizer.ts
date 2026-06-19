export type Temperature = 'normal' | 'elevated';
export type PlaceType = 'park' | 'busStop' | 'sidewalk';
export type TruckDistance = 'near' | 'medium' | 'far';

export type BinInputs = {
  fillRate: number;
  temperature: Temperature;
  placeType: PlaceType;
  truckDistance: TruckDistance;
};

export type CollectionDecision = {
  priority: number;
  action: string;
  recommendation: string;
  impact: string;
};

export function calculateCollectionDecision(inputs: BinInputs): CollectionDecision {
  const safeFillRate = Math.min(100, Math.max(0, Math.round(inputs.fillRate)));
  let priority = safeFillRate;

  if (safeFillRate > 80) {
    priority += 50;
  }

  if (inputs.temperature === 'elevated') {
    priority += 20;
  }

  if (inputs.placeType === 'park' || inputs.placeType === 'busStop') {
    priority += 15;
  }

  if (inputs.truckDistance === 'near') {
    priority += 15;
  }

  const cappedPriority = Math.min(100, priority);

  if (cappedPriority >= 80) {
    return {
      priority: cappedPriority,
      action: "Collecte aujourd'hui",
      recommendation: 'Ajouter cette poubelle à la route optimisée.',
      impact: 'Évite un débordement et améliore la propreté citoyenne.',
    };
  }

  if (cappedPriority >= 60) {
    return {
      priority: cappedPriority,
      action: 'À planifier',
      recommendation: 'Garder cette poubelle en option si le camion passe à proximité.',
      impact: 'Réduit le risque de saturation sans détour majeur.',
    };
  }

  return {
    priority: cappedPriority,
    action: 'Surveillance',
    recommendation:
      'Laisser hors de la route du jour et réévaluer au prochain relevé capteur.',
    impact: 'Préserve la capacité camion pour les points plus urgents.',
  };
}
