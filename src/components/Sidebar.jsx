import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Globe, Network, MessageCircle, Building2, 
  ChevronDown, BarChart2, Activity, TrendingUp, Scale, 
  ShieldCheck, Settings, User, Shield, ChevronLeft, ChevronRight,
  FileText
} from 'lucide-react';

// --- KOMPONEN BANTUAN ---

const MenuItem = ({ text, icon: Icon, to, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`w-full flex items-center py-2 transition-colors ${
        isCollapsed ? 'justify-center px-0' : 'px-4'
      } ${
        isActive 
          ? 'bg-[#121f35]/70 text-[#22d3ee]' 
          : 'text-[#4b6689] hover:bg-[#121f35]/50 hover:text-[#22d3ee]'
      }`}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.5} />
      
      {!isCollapsed && (
        <>
          <span className="ml-3 font-['Consolas',_monospace] text-[10.5px] tracking-[0.15em] truncate">
            {text}
          </span>
          {isActive && (
            <ChevronRight className="size-3 ml-auto opacity-70" strokeWidth={1.5} />
          )}
        </>
      )}
    </Link>
  );
};

const SubMenuItem = ({ text, icon: Icon, activeMenu, setActiveMenu }) => {
  const isActive = activeMenu === text;
  return (
    <button
      onClick={() => setActiveMenu(text)}
      className={`w-full flex items-center text-left py-2 transition-colors ${
        isActive 
          ? "text-[#22d3ee]" 
          : "text-[#3a5370] hover:text-[#22d3ee]"
      }`}
    >
      {Icon && <Icon className="size-3.5 shrink-0 mr-3" strokeWidth={1.5} />}
      <span className="font-['Consolas',_monospace] text-[9.5px] tracking-[0.15em] truncate">
        {text}
      </span>
    </button>
  );
};

// --- SIDEBAR UTAMA ---
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("DASHBOARD UTAMA");
  const [bnptOpen, setBnptOpen] = useState(false); 
  const [satkerOpen, setSatkerOpen] = useState(true);
  const [analitikOpen, setAnalitikOpen] = useState(true);

  const handleBnptClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setBnptOpen(true);
    } else {
      setBnptOpen(!bnptOpen);
    }
  };

  const location = useLocation();
  
  return (
    <aside 
      className={`relative h-screen bg-[#050a14] border-r border-[#1a2b47] flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[75px]' : 'w-[220px]'
      }`}
    >
      {/* Header Logo */}
      <div className={`flex items-center pt-2 pb-2 w-full border-b border-[#1a2b47]/60 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
        <div className="border border-[#22d3ee]/30 p-1.5 rounded-[5px] shrink-0">
          <Shield className="text-[#22d3ee] size-5" strokeWidth={1.5} />
        </div>
        {!isCollapsed && (
          <h1 className="text-white text-[17px] font-['Consolas',_monospace] font-bold tracking-[0.25em] ml-3 whitespace-nowrap">
            DEPUTI
          </h1>
        )}
      </div>

      {/* Navigasi Utama */}
      <nav className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full py-2 custom-scrollbar">
        <MenuItem text="DASHBOARD UTAMA" icon={LayoutDashboard} to="/" isCollapsed={isCollapsed} />
        <MenuItem text="INDEKS TERORISME" icon={Globe} to="/indeks" isCollapsed={isCollapsed} />
        <MenuItem text="MEDIA MONITORING" icon={FileText} to="media-monitoring" isCollapsed={isCollapsed} />
        <MenuItem text="ONTOLOGI" icon={Network} to="/ontologi" isCollapsed={isCollapsed} />
        <MenuItem text="RIWAYAT AI" icon={MessageCircle} to="/ai-history" isCollapsed={isCollapsed} />

        {/* Dropdown BNPT */}
        <div className="w-full flex flex-col mt-0.5">
          <div
            onClick={handleBnptClick}
            className={`w-full flex items-center py-2 hover:bg-[#121f35]/50 transition-colors cursor-pointer group ${
              isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
            }`}
          >
            <div className={`flex items-center text-[#4b6689] group-hover:text-[#22d3ee]`}>
              <Building2 className="size-4 shrink-0" strokeWidth={1.5} />
              {!isCollapsed && <span className="ml-3 font-['Consolas',_monospace] text-[10.5px] tracking-[0.15em] whitespace-nowrap">BNPT</span>}
            </div>
            {!isCollapsed && <ChevronDown className={`size-3 text-[#4b6689] opacity-50 transition-transform duration-300 ${bnptOpen ? "rotate-0" : "-rotate-90"}`} strokeWidth={1.5} />}
          </div>
          
          {/* Konten BNPT dengan Garis Vertikal */}
          {!isCollapsed && bnptOpen && (
            <div className="flex flex-col w-full pl-[38px] pr-3">
              <div className="border-l border-[#1a2b47]/80 pl-3.5 py-1.5 flex flex-col gap-1">
                
                {/* DIMENSI SATUAN KERJA */}
                <div className="w-full">
                  <div 
                    onClick={() => setSatkerOpen(!satkerOpen)}
                    className="flex items-center justify-between py-1 cursor-pointer text-[#3a5370] hover:text-[#22d3ee]"
                  >
                    <span className="font-['Consolas',_monospace] text-[9.5px] tracking-[0.15em] whitespace-nowrap">DIMENSI SATUAN KERJA</span>
                    <ChevronDown className={`size-2.5 opacity-40 transition-transform ${satkerOpen ? "rotate-0" : "-rotate-90"}`} strokeWidth={1.5} />
                  </div>
                  {satkerOpen && (
                    <div className="flex flex-col pl-3 mt-0.5 space-y-1">
                      <SubMenuItem text="DEPUTI PENCEGAHAN" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                      <SubMenuItem text="DEPUTI PENINDAKAN" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                      <SubMenuItem text="KERJASAMA INTERNASI.." activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    </div>
                  )}
                </div>

                {/* DIMENSI ANALITIK */}
                <div className="w-full mt-1.5">
                  <div 
                    onClick={() => setAnalitikOpen(!analitikOpen)}
                    className="flex items-center justify-between py-1 cursor-pointer text-[#3a5370] hover:text-[#22d3ee]"
                  >
                    <span className="font-['Consolas',_monospace] text-[9.5px] tracking-[0.15em] whitespace-nowrap">DIMENSI ANALITIK</span>
                    <ChevronDown className={`size-2.5 opacity-40 transition-transform ${analitikOpen ? "rotate-0" : "-rotate-90"}`} strokeWidth={1.5} />
                  </div>
                  {analitikOpen && (
                    <div className="flex flex-col pl-3 mt-1 space-y-1">
                      <SubMenuItem text="DESKRIPTIF" icon={BarChart2} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                      <SubMenuItem text="DIAGNOSTIK" icon={Activity} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                      <SubMenuItem text="PREDIKTIF" icon={TrendingUp} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="mt-0.5">
          <MenuItem text="KEJAKSAAN" icon={Scale} to="/kejaksaan" isCollapsed={isCollapsed} />
          <MenuItem text="POLRI" icon={ShieldCheck} to="/polri" isCollapsed={isCollapsed} />
          <MenuItem text="PENGATURAN" icon={Settings} to="/pengaturan" isCollapsed={isCollapsed} />
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className={`relative mt-auto w-full pt-3 pb-4 border-t border-[#1a2b47]/60 flex items-center bg-[#050a14] ${
        isCollapsed ? 'justify-center px-0' : 'px-4'
      }`}>
        
        <div className="bg-[#1a2b47]/70 p-2 rounded-full shrink-0 cursor-pointer hover:bg-[#121f35] hover:text-[#22d3ee] transition-colors">
          <User className="size-3.5 text-[#4b6689] hover:text-[#22d3ee]" strokeWidth={1.5} />
        </div>
        
        {!isCollapsed && (
          <div className="ml-3 flex flex-col justify-center whitespace-nowrap overflow-hidden gap-0.5">
            <span className="text-[#22d3ee] font-['Consolas',_monospace] font-bold text-[10.5px] tracking-[0.1em] truncate">
              DIR. INTELIJEN
            </span>
            <span className="text-[#3a5370] font-['Consolas',_monospace] text-[9px] tracking-[0.1em] truncate">
              DEPUTI II BNPT
            </span>
          </div>
        )}

        {/* Tombol Collapse Floating */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-3.5 -right-3.5 flex items-center justify-center w-7 h-7 bg-[#050a14] border border-[#1a2b47] rounded-full cursor-pointer hover:bg-[#121f35] hover:border-[#22d3ee]/50 transition-all z-50 group"
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5 text-[#4b6689] group-hover:text-[#22d3ee]" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="size-3.5 text-[#4b6689] group-hover:text-[#22d3ee]" strokeWidth={1.5} />
          )}
        </button>

      </div>
      
    </aside>
  );
};

export default Sidebar;