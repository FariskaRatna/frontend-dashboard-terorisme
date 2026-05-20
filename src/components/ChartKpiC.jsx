// src/components/ChartKpiC.jsx

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const mockData = [
  { ideologi: 'ISIS', has_attack: 83, no_attack: 28 },
  { ideologi: 'JI', has_attack: 23, no_attack: 48 },
  { ideologi: 'JAD', has_attack: 54, no_attack: 8 },
  { ideologi: 'MIT', has_attack: 13, no_attack: 1 },
  { ideologi: 'NII', has_attack: 11, no_attack: 1 },
  { ideologi: 'Lainnya', has_attack: 10, no_attack: 1 },
];

// Data khusus untuk C2 (Pie Chart) yang di-generate dari mockData
const pieData = mockData.map(item => {
  let fullName = item.ideologi;
  if (item.ideologi === 'ISIS') fullName = 'Islamic State (ISIS)';
  if (item.ideologi === 'JI') fullName = 'Jemaah Islamiyah (JI)';
  
  return {
    id: item.ideologi,
    name: fullName,
    value: item.has_attack + item.no_attack
  };
});

// Mapping warna statis berdasarkan ideologi
const IDEOLOGI_COLORS = {
  'ISIS': '#ef4444',    // Merah
  'JI': '#3b82f6',      // Biru
  'JAD': '#f97316',     // Orange
  'MIT': '#8b5cf6',     // Ungu
  'NII': '#eab308',     // Kuning/Emas
  'Lainnya': '#6b7280'  // Abu-abu
};

const TabButton = ({ id, label1, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors border-b-2 ${
        isActive
          ? "border-[#f97316] bg-[#0c182a] text-[#f97316]"
          : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
      }`}
    >
      <span className="font-tech text-[11px] font-bold tracking-widest whitespace-nowrap">
        {id} — {label1}
      </span>
    </button>
  );
};

const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1120] border border-slate-700/50 p-4 rounded-md shadow-2xl flex flex-col gap-3 min-w-[180px] z-50">
        <p className="text-slate-300 font-tech text-[14px] font-bold">{label}</p>
        {payload.map((entry, index) => {
          const labelName = entry.name === 'has_attack' ? 'Has Attack Plan' : 'No Attack Plan';
          return (
            <div key={index} className="flex justify-between items-center text-white font-number text-[11px] tracking-wider">
              <span>{labelName}</span>
              <span>: {entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1120] border border-slate-700/50 p-3 rounded-md shadow-2xl flex items-center gap-3 z-50">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].payload.fill }}></div>
        <span className="text-slate-200 font-tech text-[11px] tracking-wider font-bold">
          {payload[0].name} : <span className="font-number ml-1">{payload[0].value}</span>
        </span>
      </div>
    );
  }
  return null;
};

const ChartKpiC = () => {
  const [activeTab, setActiveTab] = useState('C1');

  // Menghitung grand total untuk Pie Chart (untuk Share/Persentase)
  const grandTotal = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b1320] border border-slate-800 rounded shadow-lg overflow-hidden">
      
      {/* Header Utama Panel */}
      <div className="flex items-center px-5 py-4 shrink-0">
        <div className="w-1 h-4 bg-[#f97316] mr-3"></div>
        <h3 className="font-tech text-[#f97316] text-[12px] font-bold tracking-widest uppercase whitespace-nowrap">
          ANALISIS KPI-C — IDEOLOGI & INTENSITAS AKSI
        </h3>
      </div>

      {/* Navigasi Tabs */}
      <div className="flex border-b border-slate-800 shrink-0">
        <TabButton id="C1" label1="Attack Plan per Ideologi" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="C2" label1="Distribusi Ideologi" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Area Konten (Bisa Scroll) */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- TAB C1: ATTACK PLAN --- */}
        {activeTab === 'C1' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#f97316] rounded-sm"></div>
                <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">
                  C1 — ATTACK PLAN PER IDEOLOGI
                </h4>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-sm"></div>
                  <span className="text-slate-400 text-[10px] font-tech tracking-wider">Has Attack Plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
                  <span className="text-slate-400 text-[10px] font-tech tracking-wider">No Attack Plan</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[250px] shrink-0 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="ideologi" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} ticks={[0, 25, 50, 75, 100]} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltipBar />} cursor={{ fill: '#cbd5e1', opacity: 0.1 }} />
                  <Bar dataKey="has_attack" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="no_attack" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6 mt-4"></div>

            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                DISTRIBUSI KASUS RENCANA SERANGAN PER IDEOLOGI · <span className="text-[#f97316]">EXEC RATE: 62.5%</span>
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                <div className="grid grid-cols-5 text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div className="text-left">IDEOLOGI</div>
                  <div className="text-center">HAS ATTACK</div>
                  <div className="text-center">NO ATTACK</div>
                  <div className="text-center">TOTAL</div>
                  <div className="text-right">RATE</div>
                </div>
                
                <div className="flex flex-col">
                  {mockData.map((row, idx) => {
                    const total = row.has_attack + row.no_attack;
                    const rate = ((row.has_attack / total) * 100).toFixed(1) + '%';
                    
                    return (
                      <div key={idx} className="grid grid-cols-5 py-3 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <div className="text-sky-100">{row.ideologi}</div>
                        <div className="text-[#ef4444] text-center">{row.has_attack}</div>
                        <div className="text-[#3b82f6] text-center">{row.no_attack}</div>
                        <div className="text-slate-400 text-center">{total}</div>
                        <div className="text-[#ef4444] text-right">{rate}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-10"></div>
            </div>
          </div>
        )}

        {/* --- TAB C2: DISTRIBUSI IDEOLOGI --- */}
        {activeTab === 'C2' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            
            {/* Header C2 */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-4 bg-[#f97316] rounded-sm"></div>
              <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">
                C2 — DISTRIBUSI IDEOLOGI
              </h4>
            </div>

            {/* Area Pie Chart & Legend Kanan */}
            <div className="flex items-center w-full h-[250px] mb-8">
              
              {/* Kiri: Donut Chart (RADIUS DIPERKECIL) */}
              <div className="flex-1 h-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      // Radius Diperkecil agar Pie terlihat lebih kecil dan proporsional
                      innerRadius={50} // Sebelumnya 65
                      outerRadius={85}  // Sebelumnya 105
                      paddingAngle={0}
                      dataKey="value"
                      stroke="#ffffff" // Warna garis pemisah antar slice sesuai background
                      strokeWidth={1}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={IDEOLOGI_COLORS[entry.id]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Kanan: Custom Legend (SPASI DIPERBAIKI) */}
              <div className="flex-1 flex flex-col justify-center gap-3 pl-4"> {/* Padding kiri dikurangi dari 8px (pl-8) ke 4px (pl-4) */}
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between w-[220px]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: IDEOLOGI_COLORS[item.id] }}></div>
                      <span className="text-slate-300 text-[11px] font-tech tracking-wider">{item.name}</span>
                    </div>
                    <span className="font-number text-[11px] font-bold" style={{ color: IDEOLOGI_COLORS[item.id] }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6"></div>

            {/* Area Tabel C2 */}
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                DISTRIBUSI IDEOLOGI · DOMINAN: <span className="text-[#f97316]">ISIS ({((mockData.find(d => d.ideologi === 'ISIS').has_attack + mockData.find(d => d.ideologi === 'ISIS').no_attack) / grandTotal * 100).toFixed(1)}%)</span>
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                
                {/* Header Tabel */}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div className="text-left">IDEOLOGI</div>
                  <div className="text-right">JUMLAH</div>
                  <div className="text-right">SHARE</div>
                </div>
                
                {/* Isi Tabel */}
                <div className="flex flex-col">
                  {pieData.map((row, idx) => {
                    const share = ((row.value / grandTotal) * 100).toFixed(1) + '%';
                    return (
                      <div key={idx} className="grid grid-cols-[2fr_1fr_1fr] py-3 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <div className="text-left font-tech tracking-wider" style={{ color: IDEOLOGI_COLORS[row.id] }}>
                          {row.name}
                        </div>
                        <div className="text-sky-100 text-right">{row.value}</div>
                        <div className="text-slate-400 text-right">{share}</div>
                      </div>
                    );
                  })}
                  
                  {/* Row Total */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] py-3 text-[11px] font-number font-bold mt-1">
                    <div className="text-white text-left font-tech tracking-wider">TOTAL</div>
                    <div className="text-white text-right">{grandTotal}</div>
                    <div className="text-slate-400 text-right">100%</div>
                  </div>
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

export default ChartKpiC;