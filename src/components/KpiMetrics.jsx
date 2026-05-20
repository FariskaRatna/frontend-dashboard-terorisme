import { ArrowUp, ArrowDown, ChevronUp, ChevronDown, Play } from 'lucide-react';

const KpiMetrics = ({ activeKpi, setActiveKpi }) => {

  return (
    <div className="flex w-full gap-4 font-['Consolas',_monospace]">
      
      {/* --- CARD 1: KPI-A (CYAN) --- */}
      <div 
        onClick={() => setActiveKpi('kpi-a')}
        className={`relative flex-[1.2] h-[125px] bg-[#050a14] border transition-all duration-300 cursor-pointer rounded-md p-4 flex flex-col justify-between overflow-hidden ${
          activeKpi === 'kpi-a' 
          ? 'border-[#22d3ee] shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
          : 'border-[#1a2b47] hover:border-[#22d3ee]/30'
        }`}
      >
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#22d3ee] via-[#22d3ee]/50 to-transparent transition-opacity duration-300 ${activeKpi === 'kpi-a' ? 'opacity-100' : 'opacity-40'}`}></div>

        <div className="flex justify-between items-start">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${activeKpi === 'kpi-a' ? 'bg-[#22d3ee]/10 border-[#22d3ee] text-[#22d3ee]' : 'border-[#1a2b47] text-[#4b6689]'}`}>KPI-A</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-[#1a2b47] text-[#4b6689]">2025</span>
          </div>
          {/* Chevron Dinamis */}
          {activeKpi === 'kpi-a' ? (
            <ChevronUp className="size-4 text-[#22d3ee] transition-colors" />
          ) : (
            <ChevronDown className="size-4 text-[#4b6689] transition-colors" />
          )}
        </div>

        <h3 className="text-[#5e7898] text-[9.4px] tracking-widest uppercase mt-1">TOTAL PUTUSAN TERORISME</h3>
        
        <div className="flex items-baseline gap-3">
          <span className="text-white text-4xl font-bold">22</span>
          <div className="flex items-center text-[#10b981] text-[12px] font-bold">
            <ArrowDown className="size-3 mr-0.5 rotate-45" />
            <span>21.4%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <p className="text-[#3a5370] text-[8.5px] tracking-tight uppercase">VS 2024 · 28 PUTUSAN</p>
          {activeKpi === 'kpi-a' && (
            <div className="flex items-center gap-1 text-[#22d3ee] text-[8px] font-bold animate-pulse">
              <Play className="size-2 fill-current" />
              <span>A1-A2-A3</span>
            </div>
          )}
        </div>
      </div>

      <div 
        onClick={() => setActiveKpi('kpi-c')}
        className={`relative flex-[1.4] h-[125px] bg-[#050a14] border transition-all duration-300 cursor-pointer rounded-md p-4 flex flex-col justify-between overflow-hidden ${
          activeKpi === 'kpi-c' 
          ? 'border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
          : 'border-[#1a2b47] hover:border-[#f97316]/30'
        }`}
      >
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f97316] via-[#f97316]/50 to-transparent transition-opacity duration-300 ${activeKpi === 'kpi-c' ? 'opacity-100' : 'opacity-40'}`}></div>

        <div className="flex justify-between items-start">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${activeKpi === 'kpi-c' ? 'bg-[#f97316]/10 border-[#f97316] text-[#f97316]' : 'border-[#1a2b47] text-[#4b6689]'}`}>KPI-C</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-[#1a2b47] text-[#4b6689]">2025</span>
          </div>
          {/* Chevron Dinamis */}
          {activeKpi === 'kpi-c' ? (
            <ChevronUp className="size-4 text-[#f97316] transition-colors" />
          ) : (
            <ChevronDown className="size-4 text-[#4b6689] transition-colors" />
          )}
        </div>

        <h3 className="text-[#5e7898] text-[9.4px] tracking-widest uppercase mt-1">KEBERHASILAN EKSEKUSI RENCANA TERORISME</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-5">
             <div className="flex flex-col">
               <span className="text-[#3a5370] text-[8px] uppercase">TOTAL</span>
               <span className="text-white text-xl font-bold leading-none">16</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[#3a5370] text-[8px] uppercase">EKSEKUSI</span>
               <div className="flex items-baseline gap-1">
                 <span className={`${activeKpi === 'kpi-c' ? 'text-[#f97316]' : 'text-white'} text-xl font-bold leading-none transition-colors`}>10</span>
                 <div className="flex items-center text-[#10b981] text-[9px]">
                   <ArrowDown className="size-2 rotate-45" />
                   <span>2.7%</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="relative w-16 h-10 flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 55" className="w-full">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a2b47" strokeWidth="12" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="47" className="transition-all duration-500" />
            </svg>
            <span className={`text-[12px] font-bold mt-[-5px] transition-colors ${activeKpi === 'kpi-c' ? 'text-[#f97316]' : 'text-white'}`}>62.5%</span>
          </div>
        </div>

        <div className="flex justify-end">
          {activeKpi === 'kpi-c' && (
            <div className="flex items-center gap-1 text-[#f97316] text-[8px] font-bold animate-pulse">
              <Play className="size-2 fill-current" />
              <span>C1-C2</span>
            </div>
          )}
        </div>
      </div>

      {/* --- CARD 3: KPI-D (PURPLE) --- */}
      <div 
        onClick={() => setActiveKpi('kpi-d')}
        className={`relative flex-[1.2] h-[125px] bg-[#050a14] border transition-all duration-300 cursor-pointer rounded-md p-4 flex flex-col justify-between overflow-hidden ${
          activeKpi === 'kpi-d' 
          ? 'border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
          : 'border-[#1a2b47] hover:border-[#8b5cf6]/30'
        }`}
      >
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8b5cf6] via-[#8b5cf6]/50 to-transparent transition-opacity duration-300 ${activeKpi === 'kpi-d' ? 'opacity-100' : 'opacity-40'}`}></div>

        <div className="flex justify-between items-start">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${activeKpi === 'kpi-d' ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#8b5cf6]' : 'border-[#1a2b47] text-[#4b6689]'}`}>KPI-D</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-[#1a2b47] text-[#4b6689]">2025</span>
          </div>
          {/* Chevron Dinamis */}
          {activeKpi === 'kpi-d' ? (
            <ChevronUp className="size-4 text-[#8b5cf6] transition-colors" />
          ) : (
            <ChevronDown className="size-4 text-[#4b6689] transition-colors" />
          )}
        </div>

        <h3 className="text-[#5e7898] text-[9.4px] tracking-widest uppercase mt-1">JALUR PAPARAN RADIKAL TERBANYAK</h3>
        
        <div className="mt-1">
          <h2 className="text-white text-[13px] leading-tight tracking-wide">
            <span className="font-bold">KAJIAN</span> PENGAJIAN INFORMAL
          </h2>
        </div>

        <div className="flex items-baseline justify-between mt-auto">
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-bold transition-colors ${activeKpi === 'kpi-d' ? 'text-[#8b5cf6]' : 'text-white'}`}>52.8%</span>
            <div className="flex flex-col">
              <span className="text-[#3a5370] text-[7px] uppercase leading-none mb-0.5">ONLINE RATE</span>
              <div className="flex items-center text-[#ef4444] text-[9px] font-bold">
                <ArrowUp className="size-2 mr-0.5" />
                <span>3.0%</span>
              </div>
            </div>
          </div>
          
          {activeKpi === 'kpi-d' && (
            <div className="flex items-center gap-1 text-[#8b5cf6] text-[8px] font-bold animate-pulse">
              <Play className="size-2 fill-current" />
              <span>D1-D2-D3</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default KpiMetrics;