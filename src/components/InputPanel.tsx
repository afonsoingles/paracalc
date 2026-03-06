import React from 'react';
import { useStore } from '../store';
import { ParachuteVisualization } from './ParachuteVisualization';
import { Language, useTranslation } from '../i18n';

interface InputPanelProps {
  language: Language;
}

export const InputPanel: React.FC<InputPanelProps> = ({ language }) => {
  const { params, updateParams, calculateTerminalVelocity } = useStore();
  const t = useTranslation(language);

  const terminalVelocity = calculateTerminalVelocity();

  const diameterFromArea = (area: number) => {
    return 2 * Math.sqrt(area / Math.PI);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div className="card">
          <div className="section-title">{t('section.parameters')}</div>

          <div className="input-group">
            <label htmlFor="mass">{t('label.mass')}</label>
        <input
          id="mass"
          type="number"
          value={params.mass}
          onChange={(e) => updateParams({ mass: parseFloat(e.target.value) })}
          step="10"
          min="10"
        />
      </div>

      <div className="input-group">
        <label htmlFor="area">Área (cm²)</label>
        <input
          id="area"
          type="number"
          value={(params.referenceArea * 10000).toFixed(0)}
          onChange={(e) => updateParams({ referenceArea: parseFloat(e.target.value) / 10000 })}
          step="10"
          min="10"
        />
        <div className="input-unit">
          {(params.referenceArea).toFixed(4)} m² | Ø {diameterFromArea(params.referenceArea).toFixed(2)}m
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="dragCoeff">k - Coeficiente de Atrito</label>
        <input
          id="dragCoeff"
          type="number"
          value={params.dragCoefficient.toFixed(2)}
          onChange={(e) => updateParams({ dragCoefficient: parseFloat(e.target.value) })}
          step="0.01"
          min="0.1"
        />
        <div className="input-unit">Paraquedas circular: 0.75-0.80 | Maior = mais lento</div>
      </div>

      <div className="input-group">
        <label htmlFor="altitude">Altitude (m)</label>
        <input
          id="altitude"
          type="number"
          value={params.deploymentAltitude}
          onChange={(e) => updateParams({ deploymentAltitude: parseFloat(e.target.value) })}
          step="10"
          min="100"
        />
      </div>

      <div className="input-group">
        <label htmlFor="airDensity">Densidade do Ar (kg/m³)</label>
        <input
          id="airDensity"
          type="number"
          value={params.airDensity.toFixed(3)}
          onChange={(e) => updateParams({ airDensity: parseFloat(e.target.value) })}
          step="0.01"
          min="0.1"
        />
        <div className="input-unit">1.225 = nível mar | Menor = mais rápido</div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="hasHole"
            checked={params.hasHole}
            onChange={(e) => updateParams({ hasHole: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="hasHole" style={{ cursor: 'pointer', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
            Com chaminé (buraco)
          </label>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '6px' }}>
          Reduz k em 20% (área não inclui chaminé)
        </div>

        {params.hasHole && (
          <div className="input-group" style={{ marginTop: '12px' }}>
            <label htmlFor="holeRadius">Raio da Chaminé (cm)</label>
            <input
              id="holeRadius"
              type="number"
              value={params.holeRadius}
              onChange={(e) => updateParams({ holeRadius: parseFloat(e.target.value) })}
              step="0.5"
              min="0.5"
            />
          </div>
        )}
      </div>

        </div>

        <div className="card">
          <ParachuteVisualization />
        </div>

        <div className="card">
          <div className="section-title">Resultados</div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{terminalVelocity.toFixed(2)}</div>
              <div className="stat-label">m/s Terminal</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{(params.deploymentAltitude / terminalVelocity).toFixed(1)}</div>
              <div className="stat-label">Tempo (s)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{(diameterFromArea(params.referenceArea) * 100).toFixed(1)}</div>
              <div className="stat-label">Diâmetro (cm)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{(diameterFromArea(params.referenceArea) * 50).toFixed(1)}</div>
              <div className="stat-label">Raio (cm)</div>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '20px' }}>
            <label htmlFor="targetVel">Velocidade Alvo (m/s)</label>
            <input
              id="targetVel"
              type="number"
              value={params.targetVelocity}
              onChange={(e) => updateParams({ targetVelocity: parseFloat(e.target.value) })}
              step="0.1"
              min="0.5"
            />
          </div>

          <div className="design-params">
            <div className="design-param">
              <div className="design-param-label">Área Necessária</div>
              <div className="design-param-value">
                {(
                  (2 * (params.mass / 1000) * 9.81) /
                  (params.airDensity * params.targetVelocity ** 2 * (params.hasHole ? params.dragCoefficient * 0.8 : params.dragCoefficient))
                ).toFixed(3)}
              </div>
              <div className="input-unit">m²</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
