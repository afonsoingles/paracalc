import React, { useEffect, useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { Charts } from './components/Charts';
import { useStore } from './store';
import { DesignPage } from './pages/DesignPage';
import { ExistingParachutePage } from './pages/ExistingParachutePage';
import { useTranslation } from './i18n';

type Page = 'design' | 'existing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('design');
  const runSimulation = useStore((state) => state.runSimulation);
  const t = useTranslation('pt');

  useEffect(() => {
    // Run initial simulation when app loads
    runSimulation();
  }, [runSimulation]);

  return (
    <>
      {/* Navigation Bar */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #334155', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          {/* Left: Menu buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setCurrentPage('design')}
              style={{
                background: currentPage === 'design' ? '#3b82f6' : 'transparent',
                color: currentPage === 'design' ? '#fff' : '#cbd5e1',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
              }}
            >
              {t('nav.design')}
            </button>
            <button
              onClick={() => setCurrentPage('existing')}
              style={{
                background: currentPage === 'existing' ? '#3b82f6' : 'transparent',
                color: currentPage === 'existing' ? '#fff' : '#cbd5e1',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
              }}
            >
              {t('nav.existing')}
            </button>
          </div>

          {/* Right: Title */}
          <h2 style={{ color: '#60a5fa', margin: 0, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            {t('app.title')}
          </h2>
        </div>
      </div>

      {/* Content */}
      {currentPage === 'design' && <DesignPage language="pt" />}
      {currentPage === 'existing' && <ExistingParachutePage language="pt" />}
    </>
  );
}

export default App;
