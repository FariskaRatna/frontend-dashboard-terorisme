// src/components/ChartPanel.jsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- DATA UNTUK HEATMAP (A2) ---
const heatmapData = [
  { year: 2022, months: [1, 1, 2, 0, 1, 1, 0, 1, 1, 0, 0, 1] },
  { year: 2021, months: [9, 11, 9, 1, 1, 0, 0, 0, 2, 1, 0, 0] },
  { year: 2020, months: [2, 0, 4, 6, 1, 3, 4, 0, 1, 2, 1, 0] },
  { year: 2019, months: [4, 5, 5, 7, 6, 2, 7, 6, 12, 8, 8, 1] },
  { year: 2018, months: [5, 3, 5, 8, 13, 3, 18, 7, 0, 0, 3, 2] },
];

const monthsLabel = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const getHeatmapColor = (val) => {
  if (val === 0) return "bg-white/5 text-transparent";
  if (val <= 2) return "bg-[#fefce8] text-[#854d0e]";
  if (val <= 6) return "bg-[#fef08a] text-[#854d0e]";
  if (val <= 12) return "bg-[#fb923c] text-white";
  if (val <= 15) return "bg-[#ea580c] text-white";
  return "bg-[#991b1b] text-white";
};

const getHeatMapColorOpacity = (val) => {
  if (val >= 11) return "bg-[#06b6d4] text-white";          
  if (val >= 8) return "bg-[#0891b2] text-white";           
  if (val >= 5) return "bg-[#155e75] text-sky-200";         
  return "bg-[#164e63] text-[#06b6d4]";                   
};

// Data yang disesuaikan dengan gambar
const mockData = [
  { year: '2013', tindakan: 8, perencanaan: 5, pelatihan: 2 },
  { year: '2014', tindakan: 6, perencanaan: 4, pelatihan: 1 },
  { year: '2015', tindakan: 6, perencanaan: 4, pelatihan: 1 },
  { year: '2016', tindakan: 4, perencanaan: 2, pelatihan: 1 },
  { year: '2017', tindakan: 7, perencanaan: 5, pelatihan: 2 },
  { year: '2018', tindakan: 12, perencanaan: 8, pelatihan: 4 },
  { year: '2019', tindakan: 38, perencanaan: 26, pelatihan: 11 },
  { year: '2020', tindakan: 19, perencanaan: 13, pelatihan: 6 },
  { year: '2021', tindakan: 36, perencanaan: 25, pelatihan: 10 },
  { year: '2022', tindakan: 57, perencanaan: 40, pelatihan: 17 },
  { year: '2023', tindakan: 17, perencanaan: 11, pelatihan: 5 },
  { year: '2024', tindakan: 14, perencanaan: 10, pelatihan: 4 },
  { year: '2025', tindakan: 11, perencanaan: 8, pelatihan: 3 },
];

// Data sesuai gambar Heatmap A2
const heatmapDataA2 = [
  { year: 2019, months: [7, 6, 8, 6, 7, 7, 6, 6, 7, 6, 5, 4] },
  { year: 2020, months: [4, 3, 4, 3, 3, 4, 3, 3, 3, 3, 3, 2] },
  { year: 2021, months: [7, 5, 9, 6, 4, 6, 4, 7, 5, 8, 6, 4] },
  { year: 2022, months: [9, 11, 14, 9, 12, 8, 9, 7, 10, 9, 8, 8] },
  { year: 2023, months: [3, 2, 4, 3, 2, 3, 2, 3, 2, 3, 4, 2] },
];

// --- DATA UNTUK TREN BULANAN (A3) ---
const trendDataA3 = [
  { date: 'Jan 2022', tindakan: 5, perencanaan: 3, pelatihan: 1 },
  { date: 'Feb 2022', tindakan: 6, perencanaan: 4, pelatihan: 2 },
  { date: 'Mar 2022', tindakan: 7, perencanaan: 5, pelatihan: 2 },
  { date: 'Apr 2022', tindakan: 5, perencanaan: 3, pelatihan: 1 },
  { date: 'Mei 2022', tindakan: 6, perencanaan: 4, pelatihan: 2 },
  { date: 'Jun 2022', tindakan: 4, perencanaan: 3, pelatihan: 1 },
  { date: 'Jul 2022', tindakan: 5, perencanaan: 3, pelatihan: 1 },
  { date: 'Agt 2022', tindakan: 4, perencanaan: 2, pelatihan: 1 },
  { date: 'Sep 2022', tindakan: 5, perencanaan: 4, pelatihan: 1 },
  { date: 'Okt 2022', tindakan: 5, perencanaan: 3, pelatihan: 1 },
  { date: 'Nov 2022', tindakan: 4, perencanaan: 3, pelatihan: 1 },
  { date: 'Des 2022', tindakan: 4, perencanaan: 3, pelatihan: 1 },
  { date: 'Jan 2023', tindakan: 2, perencanaan: 1, pelatihan: 0 },
  { date: 'Feb 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Mar 2023', tindakan: 2, perencanaan: 1, pelatihan: 1 },
  { date: 'Apr 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Mei 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Jun 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Jul 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Agt 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Sep 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
  { date: 'Okt 2023', tindakan: 2, perencanaan: 1, pelatihan: 0 },
  { date: 'Nov 2023', tindakan: 2, perencanaan: 1, pelatihan: 1 },
  { date: 'Des 2023', tindakan: 1, perencanaan: 1, pelatihan: 0 },
];

// Tooltip khusus untuk Line Chart A3 agar persis dengan gambar
const LineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1120] border border-slate-700 p-4 rounded-md shadow-2xl flex flex-col gap-3 min-w-[160px] z-50">
        <p className="text-slate-300 font-tech text-[12px] font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center text-white font-number text-[11px] tracking-wider">
            <span>{entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}</span>
            <span>: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TabButton = ({ id, label1, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors border-b-2 ${
        isActive 
          ? "border-[#06b6d4] bg-[#0c182a] text-[#06b6d4]" 
          : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
      }`}
    >
      <span className="font-tech text-[11px] font-bold tracking-widest whitespace-nowrap">
        {id} — {label1}
      </span>
    </button>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1120] border border-slate-700/50 p-3 rounded-sm shadow-xl flex flex-col gap-2">
        <p className="text-white font-number text-[11px] font-bold mb-1">Tahun {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-number text-[10px] tracking-wider" style={{ color: entry.fill }}>
            {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)} : {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartKpiA = () => {
  const [activeTab, setActiveTab] = useState('A1');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState("Periode Waktu");
  const periode = ["Periode Waktu", "Tahunan", "Bulanan"];

  const categories = ['Semua Kategori', 'Perencanaan', 'Pelatihan', 'Tindakan'];

  const CategoryDropdown = () => (
    <div className="relative inline-block text-left z-50">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 bg-[#0a1120] border border-slate-700 px-3 py-1 rounded text-[10px] font-tech font-bold text-slate-300 tracking-widest hover:border-sky-500 transition-all min-w-[150px] justify-between"
      >
        {selectedCategory}
        <ChevronDown className={`size-3 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
          <div className="absolute right-0 mt-1 w-full bg-[#0a1120] border border-slate-700 rounded shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsDropdownOpen(false);
                }}
                className={`px-4 py-2 text-[10px] font-tech font-bold tracking-widest cursor-pointer transition-colors ${
                  selectedCategory === cat 
                  ? 'bg-sky-500/10 text-[#06b6d4]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const PeriodeDropdown = () => (
    <div className="relative inline-block text-left z-50">
      <button 
        onClick={() => setIsPeriodeOpen(!isPeriodeOpen)}
        className="flex items-center gap-3 bg-[#0a1120] border border-slate-700 px-4 py-1.5 rounded text-[10px] font-tech font-bold text-slate-300 tracking-widest hover:border-sky-500 transition-all min-w-[140px] justify-between"
      >
        {selectedPeriode}
        <ChevronDown className={`size-3 text-slate-400 transition-transform duration-300 ${isPeriodeOpen ? 'rotate-180' : ''}`} />
      </button>

      {isPeriodeOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsPeriodeOpen(false)}></div>
          <div className="absolute right-0 mt-1 w-full bg-[#0a1120] border border-slate-700 rounded shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {periode.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedPeriode(cat);
                  setIsPeriodeOpen(false);
                }}
                className={`px-4 py-2 text-[10px] font-tech font-bold tracking-widest cursor-pointer transition-colors ${
                  selectedPeriode === cat 
                  ? 'bg-sky-500/10 text-sky-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 min-w-0 flex-col h-[800px] w-full bg-[#0b1320] border border-slate-800 rounded shadow-lg overflow-hidden">
      
      {/* Header Utama Panel */}
      <div className="flex items-center px-1 py-3 shrink-0">
        <div className="w-1 h-5 bg-[#06b6d4] mr-3"></div>
        <h3 className="font-tech text-[#06b6d4] text-[12px] font-bold tracking-widest uppercase whitespace-nowrap">
          ANALISIS KPI-A — VOLUME PUTUSAN TERORISME
        </h3>
      </div>

      {/* Navigasi Tabs */}
      <div className="flex border-b border-slate-800 shrink-0">
        <TabButton id="A1" label1="Volume per Tahun" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="A2" label1="Heatmap Bulanan" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="A3" label1="Tren Bulanan" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Area Konten (Bisa Scroll) */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- TAB A1: VOLUME PUTUSAN --- */}
        {activeTab === 'A1' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            
            {/* Header, Legend, & Dropdown Sejajar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                {/* Judul Tab */}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#06b6d4] rounded-sm"></div>
                  <h4 className="font-tech text-white text-[10px] font-bold uppercase">
                    A1 — VOLUME PER TAHUN
                  </h4>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#ef4444]"></div>
                    <span className="text-slate-400 text-[8px] font-tech tracking-wider">Tindakan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#3b82f6]"></div>
                    <span className="text-slate-400 text-[8px] font-tech tracking-wider">Perencanaan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#10b981]"></div>
                    <span className="text-slate-400 text-[8px] font-tech tracking-wider">Pelatihan</span>
                  </div>
                </div>
              </div>

              {/* Dropdown Kategori */}
              <CategoryDropdown />
            </div>

            {/* AREA GRAFIK */}
            <div className="w-full h-[250px] shrink-0 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
                    ticks={[0, 30, 60, 90, 120]} 
                    domain={[0, 120]}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                  />
                  <Bar dataKey="tindakan" stackId="a" fill="#ef4444" radius={[0, 0, 2, 2]} maxBarSize={30} />
                  <Bar dataKey="perencanaan" stackId="a" fill="#3b82f6" maxBarSize={30} />
                  <Bar dataKey="pelatihan" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Garis pemisah */}
            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6 mt-4"></div>
            
            {/* Area Tabel */}
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                REKAPITULASI VOLUME PER TAHUN
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                {/* Header Tabel */}
                <div className="grid grid-cols-5 text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div>TAHUN</div>
                  <div className="text-center">TINDAKAN</div>
                  <div className="text-center">PERENCANAAN</div>
                  <div className="text-center">PELATIHAN</div>
                  <div className="text-right">TOTAL</div>
                </div>
                
                {/* Isi Tabel (Menyesuaikan urutan sesuai gambar: 2025 s.d 2018) */}
                <div className="flex flex-col">
                  {mockData.slice().reverse().filter(d => parseInt(d.year) >= 2018).map((row) => {
                    const total = row.tindakan + row.perencanaan + row.pelatihan;
                    return (
                      <div 
                        key={row.year} 
                        className="grid grid-cols-5 py-3 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                      >
                        <div className="text-sky-100">{row.year}</div>
                        <div className="text-[#ef4444] text-center">{row.tindakan}</div>
                        <div className="text-[#3b82f6] text-center">{row.perencanaan}</div>
                        <div className="text-[#10b981] text-center">{row.pelatihan}</div>
                        <div className="text-white text-right">{total}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="h-10"></div>
            </div>
          </div>
        )}

        {/* --- TAB A2: HEATMAP BULANAN --- */}
        {activeTab === 'A2' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            
            {/* Header & Dropdown Sejajar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#06b6d4] rounded-sm"></div>
                <h4 className="font-tech text-white text-[10px] font-bold uppercase">
                  A2 — HEATMAP BULANAN
                </h4>
              </div>
              <CategoryDropdown />
            </div>

            {/* AREA HEATMAP KOTAK-KOTAK */}
            <div className="w-full mb-6 overflow-x-auto custom-scrollbar pb-4">
              <div className="min-w-[500px]">
                {/* Header Bulan */}
                <div className="grid grid-cols-[50px_repeat(12,_minmax(0,_1fr))] gap-2 mb-2">
                  <div></div> {/* Kosong untuk kolom tahun */}
                  {monthsLabel.map(m => (
                    <div key={m} className="text-center text-slate-500 text-[9px] font-tech font-bold uppercase">
                      {m}
                    </div>
                  ))}
                </div>

                {/* Isi Heatmap */}
                <div className="flex flex-col gap-2">
                  {heatmapDataA2.map((row) => (
                    <div key={row.year} className="grid grid-cols-[50px_repeat(12,_minmax(0,_1fr))] gap-2 items-center">
                      {/* Label Tahun */}
                      <div className="text-slate-400 text-[10px] font-number font-bold text-left">
                        {row.year}
                      </div>
                      
                      {/* Sel Angka */}
                      {row.months.map((val, idx) => (
                        <div 
                          key={idx} 
                          className={`h-9 w-full rounded-[3px] flex items-center justify-center text-[11px] font-number font-bold transition-all hover:scale-105 cursor-pointer shadow-sm ${getHeatMapColorOpacity(val)}`}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Garis Pemisah */}
            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6"></div>

            {/* AREA TABEL DISTRIBUSI */}
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                DISTRIBUSI BULANAN — {selectedCategory.toUpperCase()}
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                {/* Header Tabel */}
                <div className="grid grid-cols-6 text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div className="text-left">BULAN</div>
                  {heatmapDataA2.map(data => (
                    <div key={data.year} className="text-right pr-2">{data.year}</div>
                  ))}
                </div>
                
                {/* Isi Tabel (Looping berdasarkan index bulan) */}
                <div className="flex flex-col">
                  {monthsLabel.map((month, monthIdx) => (
                    <div 
                      key={month} 
                      className="grid grid-cols-6 py-3 text-[11px] font-number border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      {/* Nama Bulan */}
                      <div className="text-white font-bold">{month}</div>
                      
                      {/* Loop Angka berdasarkan tahun (kolom) */}
                      {heatmapDataA2.map((yearData) => (
                        <div key={`${yearData.year}-${month}`} className="text-[#06b6d4] font-bold text-right pr-2">
                          {yearData.months[monthIdx]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-10"></div>
            </div>

          </div>
        )}
        {/* --- TAB A3: TREN BULANAN --- */}
        {activeTab === 'A3' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            
            {/* Header & Dropdown Sejajar */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#06b6d4] rounded-sm"></div>
                <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">
                  A3 — TREN BULANAN
                </h4>
              </div>
              <CategoryDropdown />
            </div>

            {/* Legend (Bentuk Garis Horizontal) */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#ef4444]"></div>
                <span className="text-slate-400 text-[10px] font-tech tracking-wider">Tindakan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#3b82f6]"></div>
                <span className="text-slate-400 text-[10px] font-tech tracking-wider">Perencanaan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#10b981]"></div>
                <span className="text-slate-400 text-[10px] font-tech tracking-wider">Pelatihan</span>
              </div>
            </div>

            {/* AREA LINE CHART */}
            <div className="w-full h-[220px] shrink-0 mb-8 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendDataA3} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                    ticks={['Jan 2022', 'Jul 2022', 'Jan 2023', 'Jul 2023']} 
                    dy={10} 
                  />
                  
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
                    ticks={[0, 2, 4, 6, 8]} 
                    domain={[0, 8]}
                  />
                  
                  <Tooltip 
                    content={<LineTooltip />} 
                    cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} 
                  />
                  
                  <Line 
                    type="linear" 
                    dataKey="tindakan" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 2, stroke: '#ef4444' }} 
                    activeDot={{ r: 4, strokeWidth: 2, fill: '#ef4444', stroke: '#ffffff' }} 
                  />
                  <Line 
                    type="linear" 
                    dataKey="perencanaan" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 2, stroke: '#3b82f6' }} 
                    activeDot={{ r: 4, strokeWidth: 2, fill: '#3b82f6', stroke: '#ffffff' }} 
                  />
                  <Line 
                    type="linear" 
                    dataKey="pelatihan" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 2, stroke: '#10b981' }} 
                    activeDot={{ r: 4, strokeWidth: 2, fill: '#10b981', stroke: '#ffffff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6"></div>

            {/* AREA TABEL 24 BULAN */}
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                TREN BULANAN — {selectedCategory.toUpperCase()} (24 BULAN TERAKHIR)
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                {/* Header Tabel */}
                <div className="grid grid-cols-4 text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div className="text-left">PERIODE</div>
                  <div className="text-right">TINDAKAN</div>
                  <div className="text-right">PERENCANAAN</div>
                  <div className="text-right">PELATIHAN</div>
                </div>
                
                {/* Isi Tabel */}
                <div className="flex flex-col">
                  {trendDataA3.map((row, idx) => (
                    <div 
                      key={idx} 
                      className="grid grid-cols-4 py-3 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="text-sky-100 text-left">{row.date}</div>
                      <div className="text-[#ef4444] text-right">{row.tindakan}</div>
                      <div className="text-[#3b82f6] text-right">{row.perencanaan}</div>
                      <div className="text-[#10b981] text-right">{row.pelatihan}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-10"></div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ChartKpiA;