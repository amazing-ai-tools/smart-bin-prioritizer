import { describe, expect, it } from 'vitest';
import { calculateCollectionDecision } from './prioritizer';

describe('calculateCollectionDecision', () => {
  it('adds the requested rule weights to produce an urgent collection decision', () => {
    const decision = calculateCollectionDecision({
      fillRate: 88,
      temperature: 'elevated',
      placeType: 'park',
      truckDistance: 'near',
    });

    expect(decision.priority).toBe(100);
    expect(decision.action).toBe("Collecte aujourd'hui");
    expect(decision.recommendation).toBe(
      'Ajouter cette poubelle à la route optimisée.',
    );
    expect(decision.impact).toBe(
      'Évite un débordement et améliore la propreté citoyenne.',
    );
  });

  it('keeps low-risk bins as a monitoring recommendation', () => {
    const decision = calculateCollectionDecision({
      fillRate: 42,
      temperature: 'normal',
      placeType: 'sidewalk',
      truckDistance: 'far',
    });

    expect(decision.priority).toBe(42);
    expect(decision.action).toBe('Surveillance');
    expect(decision.recommendation).toBe(
      'Laisser hors de la route du jour et réévaluer au prochain relevé capteur.',
    );
    expect(decision.impact).toBe(
      'Préserve la capacité camion pour les points plus urgents.',
    );
  });
});
