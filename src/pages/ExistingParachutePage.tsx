import React, { useState, useEffect } from 'react';
import { Charts } from '../components/Charts';
import { ExistingParachuteData, useStore } from '../store';
import { Language, useTranslation } from '../i18n';
import { ParachuteVisualization } from '../components/ParachuteVisualization';

interface ExistingParachutePageProps {
  language: Language;
}

// Simulação local para esta página
interface SimulationResult {
  time: number;
  altitude: number;
  velocity: number;
  acceleration: number;
  terminalVelocity: number;
}

export const ExistingParachutePage: React.FC<ExistingParachutePageProps> = ({ language }) => {
  const t = useTranslation(language);
  const loadedData = useStore((state) => state.loadExistingParachuteData?.() || {
    totalMass: 1000,
    parachuteArea: 2800,
    dragCoefficient: 0.78,
    hasHole: false,
    holeRadius: 5,
    deploymentAltitude: 700,
    airDensity: 1.225,
  });

  const [data, setData] = useState<ExistingParachuteData>(loadedData);

  const [results, setResults] = useState<SimulationResult[]>([]);

  const diameterFromArea = (areaCm2: number) => {
    const areaM2 = areaCm2 / 10000;
    return 2 * Math.sqrt(areaM2 / Math.PI) * 100;
  };

  const calculateTerminalVelocity = () => {
    const massKg = data.totalMass / 1000;
    const areaCm2 = data.parachuteArea;
    const holeAreaCm2 = Math.PI * Math.pow(data.holeRadius, 2);
    const effectiveAreaCm2 = data.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;
    const effectiveAreaM2 = effectiveAreaCm2 / 10000;

    const numerator = 2 * massKg * 9.81;
    const denominator = data.airDensity * data.dragCoefficient * effectiveAreaM2;
    return Math.sqrt(numerator / denominator);
  };

  const runSimulation = () => {
    const massKg = data.totalMass / 1000;
    const areaCm2 = data.parachuteArea;
    const holeAreaCm2 = Math.PI * Math.pow(data.holeRadius, 2);
    const effectiveAreaCm2 = data.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;
    const effectiveAreaM2 = effectiveAreaCm2 / 10000;

    const simResults: SimulationResult[] = [];
    let time = 0;
    let altitude = data.deploymentAltitude;
    let velocity = 0;
    const dt = 0.01;

    while (altitude > 0) {
      const terminalVelocity = calculateTerminalVelocity();
      const dragForce = 0.5 * data.airDensity * Math.pow(velocity, 2) * data.dragCoefficient * effectiveAreaM2;
      const weightForce = massKg * 9.81;
      const netForce = weightForce - dragForce;
      const acceleration = netForce / massKg;

      simResults.push({
        time,
        altitude,
        velocity,
        acceleration,
        terminalVelocity,
      });

      velocity += acceleration * dt;
      altitude -= velocity * dt;
      time += dt;

      if (time > 1000) break;
    }

    setResults(simResults);
  };

  useEffect(() => {
    runSimulation();
  }, [data]);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    useStore.setState((state) => ({
      saveExistingParachuteData: () => {
        localStorage.setItem('existingParachuteData', JSON.stringify(data));
      }
    }));
    localStorage.setItem('existingParachuteData', JSON.stringify(data));
  }, [data]);

  const terminalVelocity = calculateTerminalVelocity();
  const areaCm2 = data.parachuteArea;
  const holeAreaCm2 = Math.PI * Math.pow(data.holeRadius, 2);
  const effectiveAreaCm2 = data.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Entrada de dados */}
        <div className="card">
          <div className="section-title">Dados do Paraquedas</div>

          <div className="input-group">
            <label htmlFor="totalMass">Massa Total (g)</label>
            <input
              id="totalMass"
              type="number"
              value={data.totalMass}
              onChange={(e) => setData({ ...data, totalMass: parseFloat(e.target.value) })}
              step="10"
              min="10"
            />
            <div className="input-unit">Paraquedas + carga + fios</div>
          </div>

          <div className="input-group">
            <label htmlFor="parachuteArea">Área do Paraquedas (cm²)</label>
            <input
              id="parachuteArea"
              type="number"
              value={data.parachuteArea}
              onChange={(e) => setData({ ...data, parachuteArea: parseFloat(e.target.value) })}
              step="10"
              min="10"
            />
            <div className="input-unit">
              {(data.parachuteArea / 10000).toFixed(4)} m² | Ø {diameterFromArea(data.parachuteArea).toFixed(1)}cm
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="dragCoeff">k - Coeficiente de Atrito</label>
            <input
              id="dragCoeff"
              type="number"
              value={data.dragCoefficient.toFixed(2)}
              onChange={(e) => setData({ ...data, dragCoefficient: parseFloat(e.target.value) })}
              step="0.01"
              min="0.1"
            />
            <div className="input-unit">Paraquedas circular: 0.75-0.80</div>
          </div>

          <div className="input-group">
            <label htmlFor="altitude">Altitude de Abertura (m)</label>
            <input
              id="altitude"
              type="number"
              value={data.deploymentAltitude}
              onChange={(e) => setData({ ...data, deploymentAltitude: parseFloat(e.target.value) })}
              step="10"
              min="100"
            />
          </div>

          <div className="input-group">
            <label htmlFor="airDensity">Densidade do Ar (kg/m³)</label>
            <input
              id="airDensity"
              type="number"
              value={data.airDensity.toFixed(3)}
              onChange={(e) => setData({ ...data, airDensity: parseFloat(e.target.value) })}
              step="0.01"
              min="0.1"
            />
            <div className="input-unit">1.225 = nível mar</div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="hasHole"
                checked={data.hasHole}
                onChange={(e) => setData({ ...data, hasHole: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="hasHole" style={{ cursor: 'pointer', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                Com chaminé (buraco)
              </label>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '6px' }}>
              Reduz a área efetiva
            </div>

            {data.hasHole && (
              <div className="input-group" style={{ marginTop: '12px' }}>
                <label htmlFor="holeRadius">Raio da Chaminé (cm)</label>
                <input
                  id="holeRadius"
                  type="number"
                  value={data.holeRadius}
                  onChange={(e) => setData({ ...data, holeRadius: parseFloat(e.target.value) })}
                  step="0.5"
                  min="0.5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="card">
          <div className="section-title">Resultados da Simulação</div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{terminalVelocity.toFixed(2)}</div>
              <div className="stat-label">m/s Terminal</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{(data.deploymentAltitude / terminalVelocity).toFixed(1)}</div>
              <div className="stat-label">Tempo Queda (s)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{(data.deploymentAltitude / terminalVelocity / 60).toFixed(2)}</div>
              <div className="stat-label">Tempo Queda (min)</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
            <div className="section-title">Dimensões</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Raio</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>
                  {(diameterFromArea(data.parachuteArea) / 2).toFixed(1)} cm
                </div>
              </div>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Diâmetro</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>
                  {diameterFromArea(data.parachuteArea).toFixed(1)} cm
                </div>
              </div>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Área Paraquedas</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>
                  {areaCm2.toFixed(0)} cm²
                </div>
              </div>
              {data.hasHole && (
                <>
                  <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Área Chaminé</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171', marginTop: '4px' }}>
                      {holeAreaCm2.toFixed(0)} cm²
                    </div>
                  </div>
                  <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Área Efetiva</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>
                      {effectiveAreaCm2.toFixed(0)} cm²
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Visualização */}
        <div className="card">
          <ParachuteVisualization externalData={data} />
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px 20px 20px' }}>
        <Charts simulationResults={results} />
      </div>
    </>
  );
};
