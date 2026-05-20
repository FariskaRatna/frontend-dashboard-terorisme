import { useState } from 'react';
import { ChevronDown, Calendar, ArrowLeft, Download } from 'lucide-react';

// --- KOMPONEN BANTUAN ---
const FilterDropdown = ({ label, category, options, activeDropdown, toggleDropdown, handleSelectFilter, filters }) => {
  const isOpen = activeDropdown === category;
  const selectedVal = filters[category];

  return (
    <div className="relative shrink-0 font-['Consolas',_monospace]">
      <button
        onClick={() => toggleDropdown(category)}
        className="flex items-center bg-[#0a1526]/80 border border-[#1a2b47] rounded-[4px] px-3.5 py-2 hover:bg-[#121f35] transition-colors cursor-pointer w-max"
      >
        <span className="text-[#5e7898] text-[10.5px] tracking-[0.1em] mr-3 uppercase">{label}</span>
        <span className="text-white text-[10.5px] font-bold tracking-[0.05em] mr-4">{selectedVal}</span>
        <ChevronDown className={`text-[#5e7898] size-3 ml-auto shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 min-w-full w-max bg-[#0b1120] border border-[#1a2b47] shadow-2xl z-50 flex flex-col rounded-[4px] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelectFilter(category, opt)}
              className={`w-full text-left px-4 py-2.5 text-[10.5px] tracking-[0.05em] transition-colors border-b border-[#1a2b47]/50 last:border-none ${
                selectedVal === opt ? "text-[#00e5ff] bg-[#121f35]" : "text-slate-300 hover:text-[#00e5ff] hover:bg-[#121f35]/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const TitleBar = () => {
  const [filters, setFilters] = useState({
    periode: "1 Bulan",
    ideologi: "Semua (ALL)",
    tingkat: "Semua (ALL)"
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  const isCustomValid = customDates.start.length === 10 && customDates.end.length === 10;

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleSelectFilter = (category, value) => {
    if (category === 'periode' && value === 'Custom Range') {
      setActiveDropdown('custom');
      setCustomDates({ start: "", end: "" });
    } else {
      setFilters(prev => ({ ...prev, [category]: value }));
      setActiveDropdown(null);
    }
  };

  const applyCustomRange = () => {
    if (isCustomValid) {
      const bulanDict = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
        "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agt",
        "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des"
      };

      const sdParts = customDates.start.split('-');
      const edParts = customDates.end.split('-');

      if (sdParts.length === 3 && edParts.length === 3) {
        const sdFmt = `${sdParts[2]} ${bulanDict[sdParts[1]]} ${sdParts[0]}`;
        const edFmt = `${edParts[2]} ${bulanDict[edParts[1]]} ${edParts[0]}`;
        setFilters(prev => ({ ...prev, periode: `${sdFmt} - ${edFmt}` }));
      } else {
        setFilters(prev => ({ ...prev, periode: `${customDates.start} - ${customDates.end}` }));
      }
      setActiveDropdown(null);
    }
  };

  return (
    <div className="w-full flex flex-col px-6 py-3 bg-[#050a14] shrink-0 relative z-30 border-b border-[#1a2b47]/60">

      {/* Kontainer Flex dengan justify-between agar terpisah kiri dan kanan */}
      <div className="flex flex-wrap items-center justify-between w-full relative">
        
        {/* KELOMPOK KIRI: Dropdown Filter */}
        <div className="flex flex-wrap items-center gap-3 z-50">
          
          {/* Filter Periode */}
          <div className="relative shrink-0 font-['Consolas',_monospace]">
            <button
              onClick={() => toggleDropdown('periode')}
              className="flex items-center bg-[#0a1526]/80 border border-[#1a2b47] rounded-[4px] px-3.5 py-2 hover:bg-[#121f35] transition-colors cursor-pointer w-max"
            >
              <span className="text-[#5e7898] text-[10.5px] tracking-[0.1em] mr-3 uppercase">PERIODE</span>
              <span className="text-white text-[10.5px] font-bold tracking-[0.05em] mr-4">{filters.periode}</span>
              <ChevronDown className={`text-[#5e7898] size-3 ml-auto shrink-0 transition-transform ${activeDropdown === 'periode' ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {activeDropdown === 'periode' && (
              <div className="absolute top-full left-0 mt-1.5 min-w-full w-max bg-[#0b1120] border border-[#1a2b47] shadow-2xl z-50 flex flex-col rounded-[4px] overflow-hidden">
                {["1 Hari", "1 Minggu", "1 Bulan", "3 Bulan", "6 Bulan", "1 Tahun", "Custom Range"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectFilter('periode', opt)}
                    className={`w-full flex items-center text-left px-4 py-2.5 text-[10.5px] tracking-[0.05em] transition-colors border-b border-[#1a2b47]/50 last:border-none ${
                      filters.periode === opt ? "text-[#00e5ff] bg-[#121f35]" : "text-slate-300 hover:text-[#00e5ff] hover:bg-[#121f35]/50"
                    }`}
                  >
                    {opt === "Custom Range" && <Calendar className="size-3.5 mr-2 text-[#00e5ff]" />}
                    <span className="whitespace-nowrap">{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {activeDropdown === 'custom' && (
              <div className="absolute top-full left-0 mt-1.5 w-[260px] bg-[#0b1120] border border-[#1a2b47] p-4 shadow-2xl z-50 rounded-[4px]">
                <div className="flex justify-between items-center border-b border-[#1a2b47] pb-3 mb-3">
                  <div className="flex items-center">
                    <Calendar className="text-[#00e5ff] size-4 mr-3" />
                    <h3 className="text-white font-bold text-[10.5px] tracking-[0.1em]">CUSTOM TIME RANGE</h3>
                  </div>
                  <ArrowLeft className="text-[#5e7898] hover:text-white size-4 cursor-pointer transition-colors" onClick={() => setActiveDropdown(null)} />
                </div>

                <div className="mb-3">
                  <label className="block text-[#5e7898] text-[9.5px] tracking-[0.1em] mb-1.5 uppercase">TANGGAL MULAI</label>
                  <div className="flex items-center bg-[#050a14] border border-[#1a2b47] px-3 py-1.5 w-full focus-within:border-[#00e5ff] transition-colors rounded-[4px] relative">
                    <input type="date" value={customDates.start} onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))} className="bg-transparent text-slate-200 text-[10.5px] outline-none w-full tracking-widest h-6" style={{ colorScheme: "dark" }} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[#5e7898] text-[9.5px] tracking-[0.1em] mb-1.5 uppercase">TANGGAL SELESAI</label>
                  <div className="flex items-center bg-[#050a14] border border-[#1a2b47] px-3 py-1.5 w-full focus-within:border-[#00e5ff] transition-colors rounded-[4px] relative">
                    <input type="date" value={customDates.end} onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))} className="bg-transparent text-slate-200 text-[10.5px] outline-none w-full tracking-widest h-6" style={{ colorScheme: "dark" }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setActiveDropdown(null)} className="w-1/2 bg-[#121f35] text-slate-300 hover:text-white hover:bg-[#1a2b47] font-bold text-[9.5px] tracking-[0.1em] py-2.5 transition-colors rounded-[4px]">BATAL</button>
                  <button onClick={applyCustomRange} disabled={!isCustomValid} className={`w-1/2 font-bold text-[9.5px] tracking-[0.1em] py-2.5 rounded-[4px] transition-colors ${isCustomValid ? "bg-[#00e5ff] text-[#050a14] hover:bg-[#00cce6] cursor-pointer" : "bg-[#121f35]/50 text-[#5e7898] cursor-not-allowed"}`}>TERAPKAN</button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Ideologi */}
          <FilterDropdown 
            category="ideologi" 
            label="IDEOLOGI" 
            options={["Semua (ALL)", "JAD", "ISIS"]} 
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            handleSelectFilter={handleSelectFilter}
            filters={filters}
          />
          
          {/* Filter Tingkat Peradilan */}
          <FilterDropdown 
            category="tingkat" 
            label="TINGKAT PERADILAN" 
            options={["Semua (ALL)", "Tingkat Pertama", "Banding", "Kasasi", "Peninjauan Kembali"]} 
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            handleSelectFilter={handleSelectFilter}
            filters={filters}
          />
        </div>

        {/* KELOMPOK KANAN: Tombol Ekspor (Didorong ke kanan oleh justify-between) */}
        <button className="flex items-center bg-[#00e5ff] text-[#050a14] px-4 py-2 hover:bg-[#00cce6] transition-colors shrink-0 cursor-pointer w-max rounded-[4px] font-['Consolas',_monospace]">
          <Download className="size-3.5 mr-2 shrink-0" strokeWidth={2} />
          <span className="font-bold text-[10.5px] tracking-[0.1em] whitespace-nowrap">EKSPOR LAPORAN</span>
        </button>

      </div>
    </div>
  );
};

export default TitleBar;