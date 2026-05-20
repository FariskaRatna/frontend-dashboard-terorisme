import { useState } from 'react';
import Header from '../components/Header';
import TitleBar from '../components/Titlebar';
import ChartPanel from '../components/ChartPanel';
import KpiMetrics from '../components/KpiMetrics';
import MapPanel from '../components/MapPanel';

const DashboardUtama = () => {
  const [activeKpi, setActiveKpi] = useState('kpi-a');

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar">
      <Header />
      <TitleBar />

      <div className="flex gap-3 px-6 pb-6 pt-2">
        <div className="flex-[1.5] flex flex-col gap-3 min-w-0">
          <KpiMetrics 
            activeKpi={activeKpi} 
            setActiveKpi={setActiveKpi} 
          />
          <MapPanel />
        </div>

        <div className="flex-1 min-w-0">
          <ChartPanel activeKpi={activeKpi} />
        </div>
      </div>
    </main>
  );
};

export default DashboardUtama;