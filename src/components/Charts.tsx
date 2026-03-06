import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';
import { useStore } from '../store';

interface ChartsProps {
  simulationResults?: any[];
}

export const Charts: React.FC<ChartsProps> = ({ simulationResults }) => {
  const storeResults = useStore((state) => state.results);
  const results = simulationResults || storeResults;

  if (results.length === 0) {
    return (
      <div className="charts">
        <div className="chart-card">
          <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 20px', fontSize: '0.95rem' }}>
            Simulação será atualizada automaticamente ao alterar parâmetros
          </p>
        </div>
        <div className="chart-card">
          <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 20px', fontSize: '0.95rem' }}>
            Simulação será atualizada automaticamente ao alterar parâmetros
          </p>
        </div>
        <div className="chart-card">
          <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 20px', fontSize: '0.95rem' }}>
            Simulação será atualizada automaticamente ao alterar parâmetros
          </p>
        </div>
        <div className="chart-card">
          <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 20px', fontSize: '0.95rem' }}>
            Simulação será atualizada automaticamente ao alterar parâmetros
          </p>
        </div>
      </div>
    );
  }

  const maxAltitude = Math.max(...results.map((r) => r.altitude));
  const maxVelocity = Math.max(...results.map((r) => r.velocity));

  return (
    <div className="charts">
      <div className="chart-card">
        <div className="chart-title">Altitude vs Tempo</div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={results} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              label={{ value: 'Tempo (s)', position: 'insideBottomRight', offset: -5 }}
              type="number"
              stroke="#64748b"
            />
            <YAxis label={{ value: 'Altitude (m)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="#60a5fa"
              fillOpacity={1}
              fill="url(#colorAlt)"
              isAnimationActive={false}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-title">Velocidade vs Tempo</div>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={results} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              label={{ value: 'Tempo (s)', position: 'insideBottomRight', offset: -5 }}
              type="number"
              stroke="#64748b"
            />
            <YAxis label={{ value: 'Velocidade (m/s)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="#60a5fa"
              dot={false}
              name="Velocidade (m/s)"
              isAnimationActive={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="terminalVelocity"
              stroke="#fbbf24"
              strokeDasharray="5 5"
              dot={false}
              name="Velocidade Terminal (m/s)"
              isAnimationActive={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-title">Aceleração vs Tempo</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={results} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              label={{ value: 'Tempo (s)', position: 'insideBottomRight', offset: -5 }}
              type="number"
              stroke="#64748b"
            />
            <YAxis label={{ value: 'Aceleração (m/s²)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="acceleration"
              stroke="#f87171"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#475569"
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-title">Velocidade vs Altitude</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={results} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="altitude"
              label={{ value: 'Altitude (m)', position: 'insideBottomRight', offset: -5 }}
              type="number"
              stroke="#64748b"
            />
            <YAxis label={{ value: 'Velocidade (m/s)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="#34d399"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
