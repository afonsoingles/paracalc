import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2PDF from 'html2pdf.js';
import { ExistingParachuteData } from '../store';

interface BuildingInstructionsProps {
  data: ExistingParachuteData;
}

export const BuildingInstructions: React.FC<BuildingInstructionsProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const diameterFromArea = (areaCm2: number) => {
    const areaM2 = areaCm2 / 10000;
    return 2 * Math.sqrt(areaM2 / Math.PI) * 100;
  };

  const diameter = diameterFromArea(data.parachuteArea);
  const radius = diameter / 2;
  const holeAreaCm2 = Math.PI * Math.pow(data.holeRadius, 2);

  // Calcular velocidade terminal (com área efetiva = área bruta - chaminé)
  const G = 9.81;
  const effectiveAreaCm2 = data.hasHole ? data.parachuteArea - holeAreaCm2 : data.parachuteArea;
  const effectiveAreaM2 = effectiveAreaCm2 / 10000;
  const massKg = data.totalMass / 1000;
  const terminalVelocity = Math.sqrt((2 * massKg * G) / (data.airDensity * data.dragCoefficient * effectiveAreaM2));

  return (
    <div ref={contentRef} style={{ 
      padding: '12mm',
      backgroundColor: 'white', 
      color: '#000',
      maxWidth: '210mm',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#000', marginBottom: '6px', fontWeight: 'bold' }}>ParaCalc</h1>
        <h2 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Guia de Construção do Paraquedas</h2>
        <p style={{ fontSize: '12px', color: '#555' }}>CanSat Junior</p>
      </div>

      {/* Resumo */}
      <div style={{ marginBottom: '20px', pageBreakAfter: 'avoid' }}>
        <h3 style={{ fontSize: '14px', color: '#000', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '10px', fontWeight: 'bold' }}>
          Especificações
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '6px', color: '#000' }}>Diâmetro:</td>
              <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{diameter.toFixed(1)} cm</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '6px', color: '#000' }}>Raio:</td>
              <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{radius.toFixed(1)} cm</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '6px', color: '#000' }}>Área:</td>
              <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{data.parachuteArea.toFixed(0)} cm²</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '6px', color: '#000' }}>Velocidade Terminal:</td>
              <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{terminalVelocity.toFixed(2)} m/s</td>
            </tr>
            {data.hasHole && (
              <>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '6px', color: '#000' }}>Raio da Chaminé:</td>
                  <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{data.holeRadius.toFixed(1)} cm</td>
                </tr>
                <tr>
                   <td style={{ padding: '6px', color: '#000' }}>Área da Chaminé:</td>
                   <td style={{ padding: '6px', color: '#000', fontWeight: 'bold' }}>{holeAreaCm2.toFixed(0)} cm²</td>
                 </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Visualizações à Escala */}
      <div style={{ marginBottom: '20px', pageBreakAfter: 'avoid' }}>
        <h3 style={{ fontSize: '14px', color: '#000', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '10px', fontWeight: 'bold' }}>
          Desenho à Escala
        </h3>

        {/* Passo 1: Paraquedas Grande */}
        <div style={{ marginBottom: '16px', pageBreakAfter: 'avoid' }}>
          <h4 style={{ fontSize: '12px', color: '#000', marginBottom: '8px', fontWeight: 'bold' }}>Construção do Círculo Grande</h4>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ border: '1px solid #000', backgroundColor: 'white' }}>
              {/* Círculo principal */}
              <circle cx="140" cy="140" r="120" fill="none" stroke="#000" strokeWidth="2" />

              {/* Raio */}
              <line x1="140" y1="140" x2="140" y2="20" stroke="#000" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="140" cy="20" r="1.5" fill="#000" />
              <text x="150" y="85" fill="#000" fontSize="11" fontWeight="bold">
                R = {radius.toFixed(1)}cm
              </text>

              {/* Centro */}
              <circle cx="140" cy="140" r="1.5" fill="#000" />
            </svg>
          </div>
          <p style={{ fontSize: '11px', color: '#555', textAlign: 'center' }}>Cortar círculo com raio {radius.toFixed(1)}cm</p>
        </div>

        {/* Passo 2: Chaminé (só se houver) */}
        {data.hasHole && (
          <div style={{ marginBottom: '16px', pageBreakAfter: 'avoid' }}>
            <h4 style={{ fontSize: '12px', color: '#000', marginBottom: '8px', fontWeight: 'bold' }}>Construção da Chaminé</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <svg width="280" height="280" viewBox="0 0 280 280" style={{ border: '1px solid #000', backgroundColor: 'white' }}>
                {/* Círculo grande (referência) */}
                <circle cx="140" cy="140" r="120" fill="none" stroke="#999" strokeWidth="1" strokeDasharray="4,4" />

                {/* Chaminé */}
                <circle cx="140" cy="140" r={Math.round(120 * (data.holeRadius / radius))} fill="none" stroke="#000" strokeWidth="2" />

                {/* Raio da chaminé */}
                <line x1="140" y1="140" x2="140" y2={140 - Math.round(120 * (data.holeRadius / radius))} stroke="#000" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="140" cy={140 - Math.round(120 * (data.holeRadius / radius))} r="1.5" fill="#000" />
                <text x="155" y={140 - Math.round(60 * (data.holeRadius / radius))} fill="#000" fontSize="11" fontWeight="bold">
                  R = {data.holeRadius.toFixed(1)}cm
                </text>

                {/* Centro */}
                <circle cx="140" cy="140" r="1.5" fill="#000" />
                <text x="140" y="20" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Chaminé (centro)
                </text>
              </svg>
            </div>
            <p style={{ fontSize: '11px', color: '#555', textAlign: 'center' }}>Cortar círculo com raio {data.holeRadius.toFixed(1)}cm no centro</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ccc', textAlign: 'center', fontSize: '9px', color: '#999', pageBreakAfter: 'avoid' }}>
        <p style={{ margin: '3px 0' }}>ParaCalc - Calculadora de Paraquedas</p>
        <p style={{ margin: '3px 0' }}>Consulte {typeof window !== 'undefined' ? window.location.hostname : 'paracalc.app'}</p>
      </div>
    </div>
  );
};

export const generateBuildingInstructionsPDF = async (contentRef: React.RefObject<HTMLDivElement>) => {
  if (!contentRef.current) return;

  try {
    const opt = {
      margin: 0,
      filename: 'ParaCalc-Guia-Construcao.pdf',
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    // @ts-ignore
    html2PDF().set(opt).from(contentRef.current).save();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF');
  }
};
