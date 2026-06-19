import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ClipboardList,
  Flame,
  Gauge,
  MapPin,
  Navigation,
  Sparkles,
  Trash2,
} from 'lucide-react';
import './styles.css';
import {
  calculateCollectionDecision,
  type PlaceType,
  type Temperature,
  type TruckDistance,
} from './prioritizer';

const appName = import.meta.env.VITE_APP_NAME || 'Smart Bin Prioritizer';
const bugzeroAppKey = import.meta.env.VITE_BUGZERO_APP_KEY || '';
const bugzeroWidgetUrl =
  import.meta.env.VITE_BUGZERO_WIDGET_URL || 'https://bugzero.amazing-ai.tools/widget.js';

function ensureBugZeroWidget() {
  if (!bugzeroAppKey || document.querySelector('script[data-bugzero-widget]')) {
    return;
  }

  const script = document.createElement('script');
  script.src = bugzeroWidgetUrl;
  script.async = true;
  script.dataset.bugzeroWidget = 'true';
  script.dataset.appKey = bugzeroAppKey;
  document.body.appendChild(script);
}

function App() {
  const [fillRate, setFillRate] = React.useState(88);
  const [temperature, setTemperature] = React.useState<Temperature>('elevated');
  const [placeType, setPlaceType] = React.useState<PlaceType>('park');
  const [truckDistance, setTruckDistance] = React.useState<TruckDistance>('near');

  React.useEffect(() => {
    ensureBugZeroWidget();
  }, []);

  const decision = calculateCollectionDecision({
    fillRate,
    temperature,
    placeType,
    truckDistance,
  });

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <div className="intro">
          <div className="brand-mark" aria-hidden="true">
            <Trash2 size={28} />
          </div>
          <div>
            <h1 id="app-title">{appName}</h1>
            <p>
              Décider quelles poubelles collecter aujourd'hui à partir de signaux
              simples: remplissage, chaleur, lieu et proximité du camion.
            </p>
          </div>
        </div>

        <div className="decision-layout">
          <form className="input-panel" aria-label="Critères de la poubelle">
            <label className="range-field" htmlFor="fill-rate">
              <span>
                <Gauge size={18} />
                Taux de remplissage
              </span>
              <strong>{fillRate}%</strong>
            </label>
            <input
              id="fill-rate"
              min="0"
              max="100"
              type="range"
              value={fillRate}
              onChange={(event) => setFillRate(Number(event.target.value))}
            />

            <fieldset>
              <legend>
                <Flame size={18} />
                Température intérieure
              </legend>
              <div className="segmented">
                <RadioButton
                  checked={temperature === 'normal'}
                  label="Normale"
                  name="temperature"
                  onChange={() => setTemperature('normal')}
                />
                <RadioButton
                  checked={temperature === 'elevated'}
                  label="Élevée"
                  name="temperature"
                  onChange={() => setTemperature('elevated')}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <MapPin size={18} />
                Type de lieu
              </legend>
              <div className="segmented three">
                <RadioButton
                  checked={placeType === 'park'}
                  label="Parc"
                  name="placeType"
                  onChange={() => setPlaceType('park')}
                />
                <RadioButton
                  checked={placeType === 'busStop'}
                  label="Abribus"
                  name="placeType"
                  onChange={() => setPlaceType('busStop')}
                />
                <RadioButton
                  checked={placeType === 'sidewalk'}
                  label="Trottoir"
                  name="placeType"
                  onChange={() => setPlaceType('sidewalk')}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <Navigation size={18} />
                Distance du camion
              </legend>
              <div className="segmented three">
                <RadioButton
                  checked={truckDistance === 'near'}
                  label="Proche"
                  name="truckDistance"
                  onChange={() => setTruckDistance('near')}
                />
                <RadioButton
                  checked={truckDistance === 'medium'}
                  label="Moyenne"
                  name="truckDistance"
                  onChange={() => setTruckDistance('medium')}
                />
                <RadioButton
                  checked={truckDistance === 'far'}
                  label="Loin"
                  name="truckDistance"
                  onChange={() => setTruckDistance('far')}
                />
              </div>
            </fieldset>
          </form>

          <aside className="result-panel" aria-label="Résultat de priorité">
            <div className="score-ring" aria-label={`Priorité ${decision.priority} sur 100`}>
              <span>{decision.priority}</span>
              <small>/100</small>
            </div>
            <div className="result-copy">
              <p className="result-label">
                <Sparkles size={18} />
                Priorité de collecte
              </p>
              <h2>{decision.action}</h2>
              <div className="result-row">
                <ClipboardList size={20} />
                <p>
                  <strong>Recommandation</strong>
                  {decision.recommendation}
                </p>
              </div>
              <div className="result-row">
                <Gauge size={20} />
                <p>
                  <strong>Impact estimé</strong>
                  {decision.impact}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

type RadioButtonProps = {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
};

function RadioButton({ checked, label, name, onChange }: RadioButtonProps) {
  return (
    <label className={checked ? 'option selected' : 'option'}>
      <input checked={checked} name={name} onChange={onChange} type="radio" />
      {label}
    </label>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
