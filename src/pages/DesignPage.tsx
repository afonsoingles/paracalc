import React, { useState, useRef } from 'react';
import { InputPanel } from '../components/InputPanel';
import { Charts } from '../components/Charts';
import { Language, useTranslation } from '../i18n';
import { useStore, ExistingParachuteData } from '../store';
import { BuildingInstructions, generateBuildingInstructionsPDF } from '../components/BuildingInstructions';

interface DesignPageProps {
  language: Language;
}

export const DesignPage: React.FC<DesignPageProps> = ({ language }) => {
  const t = useTranslation(language);
  const params = useStore((state) => state.params);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsRef = useRef<HTMLDivElement>(null);

  // Convert store params to ExistingParachuteData format
  const designData: ExistingParachuteData = {
    totalMass: params.mass,
    parachuteArea: params.referenceArea * 10000, // convert m² to cm²
    dragCoefficient: params.dragCoefficient,
    hasHole: params.hasHole,
    holeRadius: params.holeRadius,
    deploymentAltitude: params.deploymentAltitude,
    airDensity: params.airDensity,
  };

  return (
    <div className="container">
      <InputPanel language={language} />

      {/* Botão para Instruções */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px 0 20px' }}>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: showInstructions ? '#e91e63' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!showInstructions) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showInstructions) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {showInstructions ? '✕ Fechar Instruções' : '📋 Gerar Instruções de Construção'}
        </button>
      </div>

      {/* Instruções */}
      {showInstructions && (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
          <div className="card">
            <div ref={instructionsRef}>
              <BuildingInstructions data={designData} />
            </div>
            <button
              onClick={() => generateBuildingInstructionsPDF(instructionsRef)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
                marginTop: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ⬇️ Baixar PDF
            </button>
          </div>
        </div>
      )}

      {/* Gráficos */}
      {!showInstructions && <Charts />}
    </div>
  );
};
