// src/components/ChartKpiD.jsx

import { useState } from 'react';
import { Treemap, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const jalurPaparanDataTreemap = [
  { name: 'Kajian/Pengajian Informal', value: 505, color: '#ef4444' },
  { name: 'Media Sosial/Chat', value: 175, color: '#3b82f6' },
  { name: 'Video/Konten Digital ISIS', value: 137, color: '#f97316' },
  { name: 'Materi Fisik', value: 69, color: '#10b981' },
  { name: 'Pengaruh/Jaringan', value: 57, color: '#8b5cf6' },
  { name: 'Pondok/Yayasan', value: 9, color: '#eab308' },
];
const grandTotalD1 = jalurPaparanDataTreemap.reduce((acc, curr) => acc + curr.value, 0);

const motivasiData = [
  { name: 'Tegaknya Syariat/Daulah Islam', short: 'Tegaknya Syaria...', value: 309, color: '#a855f7' }, // Ungu Terang
  { name: 'Jihad Fisik', short: 'Jihad Fisik', value: 43, color: '#3b82f6' }, // Biru
  { name: 'Antipati Pemerintah', short: 'Antipati Pemeri...', value: 19, color: '#ef4444' }, // Merah
  { name: 'Hijrah ke Daulah', short: 'Hijrah ke Daulah', value: 12, color: '#f97316' }, // Oranye
  { name: 'Balas Dendam', short: 'Balas Dendam', value: 9, color: '#10b981' }, // Hijau
  { name: 'Loyalitas Organisasi', short: 'Loyalitas Organ...', value: 8, color: '#eab308' }, // Kuning
  { name: 'Pengaruh Eksternal', short: 'Pengaruh Ekster...', value: 5, color: '#7c3aed' }, // Ungu Gelap
];

const grandTotalD2 = motivasiData.reduce((acc, curr) => acc + curr.value, 0);

const faktorPemberatData = [
    { name: "Keresahan Masyarakat", short: "Keresahan Masya...", value: 194, color: '#ef4444' },
    { name: "Gangguan Keamanan Publik", short: "Gangguan Keaman...", value: 27, color: '#f97316' },
    { name: "Potensi Korban Massal", short: "Potensi Korban...", value: 4, color: '#eab'}
];

const grandTotalFaktorPemberat = faktorPemberatData.reduce((acc, curr) => acc + curr.value, 0);

const trenChannel = [
    { year: '2016', online: 3, offline: 3, hybrid: 1},
    { year: '2017', online: 6, offline: 6, hybrid: 2},
    { year: '2018', online: 10, offline: 11, hybrid: 3},
    { year: '2019', online: 31, offline: 33, hybrid: 11},
    { year: '2020', online: 17, offline: 15, hybrid: 6},
    { year: '2021', online: 32, offline: 29, hybrid: 10},
    { year: '2022', online: 51, offline: 47, hybrid: 16},
    { year: '2023', online: 15, offline: 13, hybrid: 5},
];

const CustomTreemapContent = (props) => {
  const { x, y, width, height, name, value, color } = props;
  if (!width || !height || width <= 0 || height <= 0) return null;
  const percentage = ((value / grandTotalD1) * 100).toFixed(1) + '%';
  const getTruncatedName = (text, boxWidth) => {
    const charWidth = 6.5; 
    const maxChars = Math.floor((boxWidth - 12) / charWidth); 
    if (text.length > maxChars && maxChars > 3) return text.substring(0, maxChars - 2) + '...';
    return text;
  };
  const displayName = getTruncatedName(name, width);
  const showText = width > 45 && height > 45;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill: color || '#1e293b', stroke: '#0b1320', strokeWidth: 4 }} />
      {showText && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 12} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={11} fontWeight="bold" fontFamily='tech'>{displayName}</text>
          <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={14} fontWeight="bold" fontFamily='number'>{value}</text>
          <text x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={10} fontFamily='number' opacity={0.8}>{percentage}</text>
        </>
      )}
    </g>
  );
};

// --- TOOLTIP D1 ---
const CustomTooltipTreemap = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload || payload[0]; 
    const percentage = ((data.value / grandTotalD1) * 100).toFixed(1) + '%';
    return (
      <div className="bg-[#0f172a] border border-slate-700/50 px-3 py-2.5 rounded shadow-2xl z-50">
        <span className="text-white font-tech text-[11px] tracking-wider">: {data.name}: {data.value} ({percentage})</span>
      </div>
    );
  }
  return null;
};

// --- TOOLTIP D2 (Pie Chart) ---
const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / grandTotalD2) * 100).toFixed(1) + '%';
    return (
      <div className="bg-[#0f172a] border border-slate-700/50 p-3 rounded shadow-2xl flex items-center gap-3 z-50">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }}></div>
        <span className="text-slate-200 font-tech text-[11px] tracking-wider font-bold">
          {data.name} : <span className="font-number ml-1">{data.value}</span> <span className="font-number opacity-70 font-normal">({percentage})</span>
        </span>
      </div>
    );
  }
  return null;
};

const CustomTooltipPieFaktor = ({active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / grandTotalFaktorPemberat) * 100).toFixed(1) + '%';
        return (
            <div className="bg-[#0f172a] border border-slate-700/50 p-3 rounded shadown-2xl flex items-center gap-3 z-50">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }}></div>
                <span className="text-slate-200 font-tech text-[11px] tracking-wider font-bold">
                    {data.name}: <span className="font-number ml-1">{data.value}</span> <span className="font-number opacity-70 font-normal">({percentage})</span>
                </span>
            </div>
        );
    }
    return null;
};

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

// --- TAB BUTTON HEADER ---
const TabButton = ({ id, label1, label2, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors border-b-2 ${
        isActive ? "border-[#a855f7] bg-[#0c182a] text-[#a855f7]" : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
      }`}
    >
      <span className="font-tech text-[11px] font-bold tracking-widest whitespace-nowrap">{id} — {label1}</span>
      {label2 && <span className="font-tech text-[11px] font-bold tracking-widest whitespace-nowrap">{label2}</span>}
    </button>
  );
};

// --- KOMPONEN UTAMA ---
const ChartKpiD = () => {
  const [activeTab, setActiveTab] = useState('D2'); // Saya set default ke D2 agar kamu bisa langsung lihat
  const [activeSubTabD2, setActiveSubTabD2] = useState('motivasi');

  return (
    <div className="flex flex-col h-[740px] w-full bg-[#0b1320] border border-slate-800 rounded shadow-lg overflow-hidden">
      
      {/* Header Utama Panel */}
      <div className="flex items-center px-5 py-4 shrink-0">
        <div className="w-1 h-4 bg-[#a855f7] mr-3"></div>
        <h3 className="font-tech text-[#a855f7] text-[12px] font-bold tracking-widest uppercase whitespace-nowrap">
          ANALISIS KPI-D — POLA & RADIKALISASI
        </h3>
      </div>

      {/* Navigasi Tabs */}
      <div className="flex border-b border-slate-800 shrink-0">
        <TabButton id="D1" label1="Jalur Paparan" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="D2" label1="Motivasi &" label2="Faktor Berat" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="D3" label1="Tren Channel" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Area Konten (Bisa Scroll) */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* ========================================= */}
        {/* --- TAB D1: JALUR PAPARAN --- */}
        {/* ========================================= */}
        {activeTab === 'D1' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-4 bg-[#a855f7] rounded-sm"></div>
              <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">D1 — JALUR PAPARAN</h4>
            </div>

            <div className="w-full h-[280px] shrink-0 mb-6 mt-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={jalurPaparanDataTreemap}
                  dataKey="value"
                  ratio={4 / 3}
                  content={<CustomTreemapContent />}
                  isAnimationActive={false} 
                >
                  <Tooltip content={<CustomTooltipTreemap />} />
                </Treemap>
              </ResponsiveContainer>
            </div>

            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-slate-800 mb-5"></div>

            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                JALUR PAPARAN IDEOLOGI RADIKAL · <span className="text-[#a855f7]">TOTAL: {grandTotalD1}</span>
              </h4>

              <div className="w-full bg-transparent overflow-hidden mb-6">
                <div className="grid grid-cols-[3fr_1fr_1fr] text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                  <div className="text-left">JALUR PAPARAN</div>
                  <div className="text-right pr-2">JUMLAH</div>
                  <div className="text-right pr-2">%</div>
                </div>
                
                <div className="flex flex-col">
                  {jalurPaparanDataTreemap.map((row, idx) => {
                    const percentage = ((row.value / grandTotalD1) * 100).toFixed(1) + '%';
                    return (
                      <div key={idx} className="grid grid-cols-[3fr_1fr_1fr] py-2 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <div className="flex items-center gap-2.5 text-white">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: row.color }}></div>
                          <span className="font-tech tracking-wider" style={{ color: row.color }}>{row.name}</span>
                        </div>
                        <div className="text-sky-100 text-right pr-2">{row.value}</div>
                        <div className="text-slate-400 text-right pr-2">{percentage}</div>
                      </div>
                    );
                  })}
                  
                  <div className="grid grid-cols-[3fr_1fr_1fr] py-2 text-[11px] font-number font-bold mt-1 text-white">
                    <div className="text-left font-tech tracking-wider">TOTAL</div>
                    <div className="text-right pr-2">{grandTotalD1}</div>
                    <div className="text-slate-400 text-right pr-2">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* --- TAB D2: MOTIVASI & FAKTOR BERAT --- */}
        {/* ========================================= */}
        {activeTab === 'D2' && (
          <div className="flex flex-col animate-in fade-in duration-300">
            
            {/* Header D2 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#a855f7] rounded-sm"></div>
              <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">
                D2 — MOTIVASI & FAKTOR BERAT
              </h4>
            </div>

            {/* Sub-Tabs (Motivasi Aksi vs Faktor Pemberat) */}
            <div className="flex gap-2 mb-8">
              <button 
                onClick={() => setActiveSubTabD2('motivasi')}
                className={`flex-1 py-2 rounded-[3px] text-[11px] font-tech font-bold tracking-widest transition-colors border ${
                  activeSubTabD2 === 'motivasi' 
                  ? 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10' 
                  : 'border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
              >
                Motivasi Aksi
              </button>
              <button 
                onClick={() => setActiveSubTabD2('faktor')}
                className={`flex-1 py-2 rounded-[3px] text-[11px] font-tech font-bold tracking-widest transition-colors border ${
                  activeSubTabD2 === 'faktor' 
                  ? 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10' 
                  : 'border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
              >
                Faktor Pemberat
              </button>
            </div>

            {activeSubTabD2 === 'motivasi' ? (
              <>
                {/* Area Chart & Legend */}
                <div className="flex items-center w-full h-[180px] mb-8 mt-2">
                  
                  {/* Kiri: Donut Chart */}
                  <div className="flex-1 h-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={motivasiData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={70}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="#0b1320" // Garis pemisah irisan
                          strokeWidth={1}
                        >
                          {motivasiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltipPie />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Kanan: Custom Legend */}
                  <div className="flex-1 flex flex-col justify-center gap-2.5 pl-4">
                    {motivasiData.map((item, idx) => {
                      const share = ((item.value / grandTotalD2) * 100).toFixed(1) + '%';
                      return (
                        <div key={idx} className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-300 text-[10px] font-tech tracking-wider">{item.short}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-number text-[11px] font-bold" style={{ color: item.color }}>
                              {item.value}
                            </span>
                            <span className="font-number text-[10px] text-slate-500 w-8 text-right">
                              {share}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-slate-800 mb-5"></div>

                {/* Area Tabel D2 */}
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h4 className="font-tech text-slate-500 text-[9px] font-bold tracking-widest uppercase mb-4">
                    MOTIVASI AKSI
                  </h4>

                  <div className="w-full bg-transparent overflow-hidden mb-6">
                    <div className="grid grid-cols-[3fr_1fr_1fr] text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-2 border-b border-slate-800">
                      <div className="text-left pl-1">MOTIVASI</div>
                      <div className="text-right">N</div>
                      <div className="text-right">%</div>
                    </div>
                    
                    <div className="flex flex-col">
                      {motivasiData.map((row, idx) => {
                        const share = ((row.value / grandTotalD2) * 100).toFixed(1) + '%';
                        return (
                          <div key={idx} className="grid grid-cols-[3fr_1fr_1fr] py-2.5 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <div className="text-left font-tech tracking-wider pl-1" style={{ color: row.color }}>
                              {row.name}
                            </div>
                            <div className="text-sky-100 text-right">{row.value}</div>
                            <div className="text-slate-400 text-right">{share}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Fallback Jika tab Faktor Pemberat diklik */
              <>
                <div className="flex items-center w-full h-[180px] mb-8 mt-2">
                    <div className="flex-1 h-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={faktorPemberatData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={70}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="#0b1320"
                                    strokeWidth={1}
                                >
                                    {faktorPemberatData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltipPieFaktor />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex-1 flex-col justify-center gap-2.5 pl-4">
                        {faktorPemberatData.map((item, idx) => {
                            const share = ((item.value / grandTotalFaktorPemberat) * 100).toFixed(1) + '%';
                            return (
                                <div key={idx} className="flex items-center justify-between w-full pr-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-slate-300 text-[10px] font-tech tracking-wider">{item.short}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-number text-[11px] font-bold" style={{ color: item.color }}>
                                            {item.value}
                                        </span>
                                        <span className="font-number text-[10px] text-slate-500 w-8 text-right">
                                            {share}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    </div>
                    <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-slate-800 mb-5"></div>

                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <h4 className="font-tech text-slate-500 text-[9px] font-bold tracking-widest uppercase mb-4">
                            FAKTOR PEMBERAT
                        </h4>

                        <div className="w-full bg-transparent overflow-hidden mb-6">
                            <div className="grid grid-cols-[3fr_1fr_1fr] text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-2 border-b border-slate-800">
                                <div className="text-left pl-1">FAKTOR</div>
                                <div className="text-right">N</div>
                                <div className="text-right">%</div>
                            </div>

                            <div className="flex flex-col">
                                {faktorPemberatData.map((row, idx) => {
                                    const share = ((row.value / grandTotalFaktorPemberat) * 100).toFixed(1) + "%";
                                    return (
                                        <div key={idx} className="grid grid-cols-[3fr_1fr_1fr] py-2.5 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                            <div className="text-left font-tech tracking-wider pl-1" style={{ color: row.color }}>
                                                {row.name}
                                            </div>
                                            <div className="text-sky-100 text-right">{row.value}</div>
                                            <div className="text-slate-400 text-right">{share}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                </div>
            </>
            )}
          </div>
        )}

        {activeTab === 'D3' && (
           <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#a855f7] rounded-sm"></div>
                    <h4 className="font-tech text-white text-[11px] font-bold tracking-widest uppercase">D3 — TREN CHANNEL</h4>
                </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-[#ef4444]"></div>
                    <span className="text-slate-400 text-[10px] font-tech tracking-wider">Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-[#10b981]"></div>
                    <span className="text-slate-400 text-[10px] font-tech tracking-wider">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-[#3b82f6]"></div>
                    <span className="text-slate-400 text-[10px] font-tech tracking-wider">Hybrid</span>
                </div>
            </div>

            <div className="w-full h-[220px] shrink-0 mb-8 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trenChannel} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#1e293b' />

                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                            ticks={[ '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                            ticks={[0, 15, 30, 45, 60]}
                            domain={[0, 8]}
                        />

                        <Tooltip
                            content={<LineTooltip />}
                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />

                        <Line
                            type="linear"
                            dataKey="online"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 2, stroke: '#ef4444' }}
                            activeDot={{ fill: '#ef4444', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                        />
                        <Line
                            type="linear"
                            dataKey="offline"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 2, stroke: '#10b981' }}
                            activeDot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                        />
                        <Line
                            type="linear"
                            dataKey="hybrid"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 2, stroke: '#3b82f6' }}
                            activeDot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="-mx-6 w-[calc(100%+3rem)] h-[1px] bg-slate-800 mb-6"></div>

            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="font-tech text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                    TREN JALUR PAPARAN PER CHANNEL
                </h4>
                
                <div className="w-full bg-transparent overflow-hidden mb-6">
                    <div className="grid grid-cols-4 text-slate-500 text-[9px] font-tech font-bold uppercase tracking-widest py-3 border-b border-slate-800">
                        <div className="text-left">TAHUN</div>
                        <div className="text-right">Online</div>
                        <div className="text-right">Offline</div>
                        <div className="text-right">Hybrid</div>
                    </div>
                    
                    <div className="flex flex-col">
                        {trenChannel.map((row, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-4 py-3 text-[11px] font-number font-bold border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                            >
                                <div className='text-sky-100 text-left'>{row.year}</div>
                                <div className='text-[#ef4444] text-right'>{row.online}</div>
                                <div className='text-[#10b981] text-right'>{row.offline}</div>
                                <div className='text-[#3b82f6] text-right'>{row.hybrid}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='h-10'></div>
            </div>

           </div>
        )}

      </div>
    </div>
  );
};

export default ChartKpiD;