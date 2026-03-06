import React from 'react';
import { useStore } from '../store';
import { ExistingParachuteData } from '../store';

interface ParachuteVisualizationProps {
  externalData?: ExistingParachuteData;
}

export const ParachuteVisualization: React.FC<ParachuteVisualizationProps> = ({ externalData }) => {
  const storeParams = useStore((state) => state.params);
  const params = externalData ? {
    referenceArea: externalData.parachuteArea / 10000, // convert cm² to m²
    holeRadius: externalData.holeRadius,
    hasHole: externalData.hasHole,
  } : {
    referenceArea: storeParams.referenceArea,
    holeRadius: storeParams.holeRadius,
    hasHole: storeParams.hasHole,
  };

  // Calcular raio do paraquedas em cm
  const radiusM = Math.sqrt(params.referenceArea / Math.PI);
  const radiusCm = radiusM * 100;
  
  // Área do paraquedas
  const areaCm2 = params.referenceArea * 10000;
  
  // Área da chaminé
  const holeAreaCm2 = Math.PI * Math.pow(params.holeRadius, 2);
  
  // Área efetiva (paraquedas - chaminé)
  const effectiveAreaCm2 = params.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;

  // Escala para desenho (max 200px de raio)
  const scale = 200 / radiusCm;
  const svgRadius = radiusCm * scale;
  const svgHoleRadius = params.holeRadius * scale;
  const centerX = 220;
  const centerY = 220;

  return (
    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
      <div className="section-title">Geometria do Paraquedas</div>
      
      {/* SVG Drawing */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <svg width="440" height="440" viewBox="0 0 440 440" style={{ background: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
          {/* Paraquedas */}
          <circle
            cx={centerX}
            cy={centerY}
            r={svgRadius}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
          />
          
          {/* Raio do paraquedas (superior) */}
          <line
            x1={centerX}
            y1={centerY - svgRadius}
            x2={centerX}
            y2={centerY}
            stroke="#60a5fa"
            strokeWidth="1.5"
          />
          <text
            x={centerX + 15}
            y={centerY - svgRadius / 2}
            fill="#60a5fa"
            fontSize="13"
            fontWeight="bold"
          >
            {radiusCm.toFixed(1)}cm
          </text>
          
          {/* Chaminé */}
          {params.hasHole && (
            <>
              <circle
                cx={centerX}
                cy={centerY}
                r={svgHoleRadius}
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              
              {/* Raio da chaminé */}
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + svgHoleRadius}
                y2={centerY}
                stroke="#f87171"
                strokeWidth="2"
              />
              <text
                x={centerX + svgHoleRadius / 2}
                y={centerY - 12}
                fill="#f87171"
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
              >
                {params.holeRadius.toFixed(1)}cm
              </text>
            </>
          )}
          
          {/* Diâmetro (topo) */}
          <text
            x={centerX}
            y="30"
            fill="#e2e8f0"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Ø {(radiusCm * 2).toFixed(1)}cm
          </text>
        </svg>
      </div>

      {/* Dimensões em Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Raio
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginTop: '6px' }}>
            {radiusCm.toFixed(1)}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm</div>
        </div>
        
        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Diâmetro
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginTop: '6px' }}>
            {(radiusCm * 2).toFixed(1)}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm</div>
        </div>
        
        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Área Paraquedas
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginTop: '6px' }}>
            {areaCm2.toFixed(0)}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm²</div>
        </div>
        
        {params.hasHole && (
          <>
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Raio Chaminé
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f87171', marginTop: '6px' }}>
                {params.holeRadius.toFixed(1)}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm</div>
            </div>
            
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Área Chaminé
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f87171', marginTop: '6px' }}>
                {holeAreaCm2.toFixed(0)}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm²</div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '14px', borderRadius: '10px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                ⚡ Área Efetiva (Paraquedas - Chaminé)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399', marginTop: '6px' }}>
                {effectiveAreaCm2.toFixed(0)}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>cm²</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
