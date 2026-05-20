import ChartKpiA from "./ChartKpiA";
import ChartKpiC from "./ChartKpiC";
import ChartKpiD from "./ChartKpiD";

const ChartPanel = ({ activeKpi }) => {
  
  if (activeKpi === 'kpi-a') return <ChartKpiA />;
  if (activeKpi === 'kpi-c') return <ChartKpiC />;
  if (activeKpi === 'kpi-d') return <ChartKpiD />;
  
  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b1320] border border-slate-800 rounded flex items-center justify-center">
      <p className="text-slate-500 font-tech">Data untuk {activeKpi} sedang dalam pengembangan.</p>
    </div>
  );
};

export default ChartPanel;