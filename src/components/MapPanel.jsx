import React, { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronDown, ChevronUp, Play, Pause, SkipBack, X } from "lucide-react";

const TOTAL_STEPS = 120; 

const IDEOLOGY_COLORS = {
  "JAD": "#3b82f6",  
  "ISIS": "#ef4444", 
  "JI": "#f97316",   
  "MIT": "#a855f7",  
  "NII": "#14b8a6",  
  "FPI": "#22c55e",  
  "AQ": "#dc2626",   
  "MMI": "#eab308",  
  "KHI": "#64748b",  
  "MPI": "#ec4899"   
};

const RadarChart = ({ ideologies, totalCases }) => {
  const size = 160;
  const center = size / 2;
  const radius = 50;
  const keys = ["ISIS", "JI", "JAD", "MIT", "NII", "FPI", "AQ", "MMI", "KHI", "MPI"];

  const maxVal = Math.max(...keys.map(k => ideologies[k] || 0), 1);

  const getPoint = (value, index, scale = 1) => {
    // 360 derajat / 10 sisi = 36
    const angle = (index * 36 - 90) * (Math.PI / 180);
    const r = (value / maxVal) * radius * scale;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = keys.map((k, i) => getPoint(ideologies[k] || 0, i));
  const dataPolygonStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  const gridLevels = [0.33, 0.66, 1];

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {gridLevels.map(level => {
        const pts = keys.map((k, i) => getPoint(maxVal, i, level));
        return <polygon key={level} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#1e293b" strokeWidth="1" />
      })}
      
      {keys.map((k, i) => {
        const p = getPoint(maxVal, i);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#1e293b" strokeWidth="1" />
      })}
      
      <polygon points={dataPolygonStr} fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="1.5" />
      
      {keys.map((k, i) => {
        const val = ideologies[k] || 0;
        const p = getPoint(val, i);
        const labelP = getPoint(maxVal, i, 1.35); 
        const color = IDEOLOGY_COLORS[k] || "#64748b";
        return (
          <g key={k}>
            <circle cx={p.x} cy={p.y} r="2.5" fill={color} />
            <text x={labelP.x} y={labelP.y} fill={color} fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              {k}
              <tspan x={labelP.x} dy="12">{val}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const MapPanel = () => {
  const [activeTab, setActiveTab] = useState("B1");
  const [geoData, setGeoData] = useState(null);

  const [isLayerOpen, setIsLayerOpen] = useState(true);
  const [clusterData, setClusterData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/clusters")
      .then(res => res.json())
      .then(data => setClusterData(data))
      .catch(err => console.error("Gagal mengambil kluster", err))
  }, []);

  const [showChoropleth, setShowChoropleth] = useState(true);
  const [showCluster, setShowCluster] = useState(true);

  const [selectedProvince, setSelectedProvince] = useState(null);

  const [isRankingOpen, setIsRankingOpen] = useState(true);
  const [rankingList, setRankingList] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(TOTAL_STEPS - 1); 

  const geoJsonLayerRef = useRef(null);
  const showChoroplethRef = useRef(showChoropleth);
  const currentStepRef = useRef(currentStep); 

  useEffect(() => { showChoroplethRef.current = showChoropleth; }, [showChoropleth]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev >= TOTAL_STEPS - 1 ? 0 : prev + 1));
      }, 700); 
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson")
    .then((res) => res.json())
    .then((data) => setGeoData(data));
  }, []);

  const getCasesCount = (provName, step) => {
    const hash = provName.length * 5 + provName.charCodeAt(0) * 2 + (step * 13);
    return hash % 60; 
  };

  const getProvinceIdeologies = (provName, totalCases) => {
    if (totalCases === 0) return { ISIS: 0, JI: 0, JAD: 0, MIT: 0, NII: 0, FPI: 0, AQ: 0, MMI: 0, KHI: 0, MPI: 0 };
    const hash1 = provName.charCodeAt(0)
    const hash2 = provName.charCodeAt(provName.length - 1);

    // 10 bobot untuk 10 ideologi
    const weights = [
      (hash1 % 5)+1, (hash2 % 4)+1, ((hash1+hash2) % 6)+1, (hash1 % 3)+1, 
      (hash2 % 5)+1, ((hash1*2) % 4)+1, ((hash2*2) % 3)+1, (hash1 % 2)+1, 
      (hash2 % 2)+1, 1
    ];
    const keys = ["ISIS", "JI", "JAD", "MIT", "NII", "FPI", "AQ", "MMI", "KHI", "MPI"];
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let result = {};
    let assigned = 0;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        result[key] = totalCases - assigned;
      } else {
        const val = Math.round((weights[i] / totalWeight) * totalCases);
        result[key] = val;
        assigned += val;
      }
    });
    
    // Safety check jika pembulatan melebihi totalCases
    if (assigned > totalCases) { 
      result[keys[0]] -= (assigned - totalCases); 
      result[keys[keys.length - 1]] = 0; 
    }
    return result;
  }

  const getDominantIdeology = (ideologiesObj) => {
    if (!ideologiesObj || Object.keys(ideologiesObj).length === 0) return "N/A";
    return Object.keys(ideologiesObj).reduce((a, b) => ideologiesObj[a] > ideologiesObj[b] ? a : b);
  };

  const getChoroplethColor = (cases) => {
    if (cases > 47) return "#ef4444"; 
    if (cases >= 32) return "#f87171"; 
    if (cases >= 21) return "#f97316"; 
    if (cases >= 9) return "#eab308";  
    if (cases >= 1) return "#22c55e";  
    return "transparent";
  };

  const timelineData = useMemo(() => {
    if (!geoData || !geoData.features) return [];
    const data = [];
    for (let step = 0; step < TOTAL_STEPS; step++) {
      let totalNasional = 0;
      geoData.features.forEach(f => { totalNasional += getCasesCount(f.properties.Propinsi, step); });
      data.push({ step, totalCases: totalNasional, year: 2014 + Math.floor(step / 12), month: (step % 12) + 1 });
    }
    const sorted = [...data].sort((a, b) => b.totalCases - a.totalCases);
    const top3Steps = sorted.slice(0, 3).map(d => d.step);
    return data.map(d => ({ ...d, isTop3: top3Steps.includes(d.step) }));
  }, [geoData]);

  const maxNasionalCases = timelineData.length > 0 ? Math.max(...timelineData.map(d => d.totalCases)) : 1;

  useEffect(() => {
    if (geoData && geoData.features) {
      const data = geoData.features.map(f => {
        const rawName = f.properties.Propinsi.toLowerCase();
        const name = rawName.replace(/\b\w/g, l => l.toUpperCase());
        const cases = getCasesCount(f.properties.Propinsi, currentStep); 
        const ideologies = getProvinceIdeologies(f.properties.Propinsi, cases);
        return { name, cases, rawName: f.properties.Propinsi, ideologies };
      }).filter(d => d.cases > 0).sort((a, b) => b.cases - a.cases); 
      setRankingList(data);
    }
  }, [geoData, currentStep]);
  
  const detailData = useMemo(() => {
    if (!selectedProvince) return null;
    const rankIndex = rankingList.findIndex(r => r.rawName === selectedProvince);
    if (rankIndex === -1) return null; 
    return { ...rankingList[rankIndex], rank: rankIndex + 1 };
  }, [selectedProvince, rankingList]);

  useEffect(() => {
    if (selectedProvince && !detailData) setSelectedProvince(null);
  }, [detailData, selectedProvince]);

  const getFeatureStyle = (feature, step) => {
    const cases = getCasesCount(feature.properties.Propinsi, step);
    const isActive = showChoroplethRef.current; 
    const isSelected = feature.properties.Propinsi === selectedProvince;
    
    return { 
      fillColor: isActive ? getChoroplethColor(cases) : "transparent", 
      fillOpacity: isSelected ? 0.9 : (isActive ? 0.6 : 0), 
      color: isSelected ? "#ffffff" : "#1e293b", 
      weight: isSelected ? 2 : 1 
    };
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer) => {
        const feature = layer.feature;
        layer.setStyle(getFeatureStyle(feature, currentStep));
        const cases = getCasesCount(feature.properties.Propinsi, currentStep);
        layer.setTooltipContent(`
          <div class="bg-[#0f172a]/95 border border-slate-600 p-2.5 rounded shadow-2xl backdrop-blur-md text-white font-sans min-w-[140px]">
            <div class="font-bold text-[11px] mb-1.5 uppercase">${feature.properties.Propinsi}</div>
            <div class="text-slate-300 text-[10px] mb-0.5">
              Est. kasus: <span class="text-yellow-500 font-bold text-[11px]">${cases}</span>
            </div>
            <div class="text-slate-500 text-[8px] mt-1">(Klik untuk detail)</div>
          </div>
        `);
      });
    }
  }, [showChoropleth, currentStep, selectedProvince]);

  const onEachProvince = (province, layer) => {
    layer.bindTooltip("", { sticky: true, className: "custom-leaflet-tooltip", direction: "top" });
    layer.on({
      mouseover: (e) => {
        const targetLayer = e.target;
        const currentCases = getCasesCount(targetLayer.feature.properties.Propinsi, currentStepRef.current);
        targetLayer.setStyle({ fillColor: getChoroplethColor(currentCases), fillOpacity: 0.8, color: "#ffffff", weight: 2 });
        targetLayer.bringToFront(); 
      },
      mouseout: (e) => {
        e.target.setStyle(getFeatureStyle(e.target.feature, currentStepRef.current));
      },
      click: (e) => {
        const provName = e.target.feature.properties.Propinsi;
        if (getCasesCount(provName, currentStepRef.current) > 0) {
          setSelectedProvince(provName);
        }
      }
    });    
  };

  const createPieChartIcon = (city) => {
    const { ideologies, total } = city;
    let gradientStr = "";
    let currentPct = 0;

    Object.entries(ideologies).forEach(([ideo, count], index) => {
      const pct = (count / total) * 100;
      const color = IDEOLOGY_COLORS[ideo] || "#94a3b8"; 
      gradientStr += `${color} ${currentPct}% ${currentPct + pct}%${index !== Object.keys(ideologies).length - 1 ? ', ' : ''}`;
      currentPct += pct;
    });

    const htmlString = `
      <div style="
        width: 32px; height: 32px; 
        border-radius: 50%; 
        background: conic-gradient(${gradientStr});
        border: 2px solid #0a1120; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        display: flex; justify-content: center; align-items: center;
        color: white; 
        font-family: monospace; 
        font-size: 11px; 
        font-weight: bold;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 2px 3px rgba(0,0,0,0.8);
      ">
        ${total}
      </div>
    `;

    return L.divIcon({
      html: htmlString,
      className: "custom-pie-cluster",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const ToggleSwitch = ({ isActive, onToggle, activeColor }) => (
    <div onClick={onToggle} className={`w-7 h-4 rounded-full flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${isActive ? activeColor : 'bg-slate-700'}`}>
      <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-3' : 'translate-x-0'}`} />
    </div>
  );

  const maxCases = rankingList.length > 0 ? rankingList[0].cases : 1;
  const currentTimelineInfo = timelineData[currentStep] || { year: 2026, month: 12 };

  const ideologyLegendItems = [
    { id: "JAD", color: "bg-blue-500" }, { id: "ISIS", color: "bg-red-500" },
    { id: "JI", color: "bg-orange-500" }, { id: "MIT", color: "bg-purple-500" },
    { id: "NII", color: "bg-teal-500" }, { id: "FPI", color: "bg-green-500" },
    { id: "AQ", color: "bg-red-600" }, { id: "MMI", color: "bg-yellow-500" },
    { id: "KHI", color: "bg-slate-500" }, { id: "MPI", color: "bg-pink-500" },
  ];

  return (
    <div className="flex flex-col w-full h-[664px] bg-[#0a1120] border border-slate-800 rounded-sm overflow-hidden shadow-2xl font-sans">
      
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800/50 bg-[#070d1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 bg-sky-500 rounded-sm"></div>
          <h3 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">PETA SEBARAN KASUS TERORISME</h3>
        </div>
      </div>

      <div className="relative flex-grow w-full bg-[#040813] overflow-hidden group">
        
        <div className="absolute top-5 left-5 z-[400] flex flex-col w-[180px] bg-[#0a1120]/95 border border-slate-700 rounded shadow-2xl backdrop-blur-md">
          <button onClick={() => setIsLayerOpen(!isLayerOpen)} className="flex items-center justify-between px-3 py-2.5 text-[9px] font-bold text-slate-300 tracking-widest hover:text-white transition-all w-full">
            LAYER KONTROL {isLayerOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
          {isLayerOpen && (
          <div className="px-3 pb-3 flex flex-col gap-3 border-t border-slate-800 pt-2.5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <ToggleSwitch isActive={showChoropleth} onToggle={() => setShowChoropleth(!showChoropleth)} activeColor="bg-red-500" />
                <span className={`text-[9px] font-bold tracking-wider ${showChoropleth ? 'text-red-500' : 'text-slate-500'}`}>B1 CHOROPLETH</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ToggleSwitch isActive={showCluster} onToggle={() => setShowCluster(!showCluster)} activeColor="bg-indigo-500" />
                <span className={`text-[9px] font-bold tracking-wider ${showCluster ? 'text-indigo-400' : 'text-slate-500'}`}>B2 KLUSTER</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-1 pt-2.5 border-t border-slate-800/50">
              <span className="text-[8px] font-bold tracking-widest text-slate-500 mb-0.5">B1 - TOTAL KASUS</span>
              {[ { color: "bg-red-500", label: "> 47" }, { color: "bg-red-400", label: "32-47" }, { color: "bg-orange-500", label: "21-32" }, { color: "bg-yellow-500", label: "9-21" }, { color: "bg-green-500", label: "1-9" }].map((item, i) => (
                <div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-[2px] ${item.color}`}></div><span className="text-[10px] text-slate-300 font-bold">{item.label}</span></div>
              ))}
            </div>
            
            <div className="flex flex-col gap-1.5 mt-1 pt-2.5 border-t border-slate-800/50">
              <span className="text-[8px] font-bold tracking-widest text-slate-500 mb-0.5">B2 - IDEOLOGI</span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-1">
                {ideologyLegendItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-[9px] text-slate-300 font-bold">{item.id}</span>
                  </div>
                ))}
              </div>
              <span className="text-[7px] text-slate-500 font-bold mt-1 tracking-widest">angka = total kasus</span>
            </div>
          </div>
          )}
        </div>

        <div className="absolute top-5 right-5 z-[400] flex flex-col w-[240px] bg-[#0a1120]/95 border border-slate-700 rounded shadow-2xl backdrop-blur-md max-h-[430px] overflow-hidden">
          {!selectedProvince && (
            <>
              <button onClick={() => setIsRankingOpen(!isRankingOpen)} className="flex items-center justify-between px-3 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest hover:text-white transition-all w-full border-b border-slate-800">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-slate-500 uppercase text-[9px]">RANKING PROVINSI</span>
                  <span className="text-sky-400 capitalize text-[10px]">Bulan {currentTimelineInfo.month} / {currentTimelineInfo.year}</span>
                </div>
                {isRankingOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
              {isRankingOpen && (
                <div className="flex flex-col p-3 gap-3.5 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                  {rankingList.map((item, index) => {
                    const color = getChoroplethColor(item.cases);
                    return (
                      <div key={item.name} className="flex flex-col cursor-pointer hover:bg-slate-800/50 p-1 -mx-1 rounded transition-colors" onClick={() => setSelectedProvince(item.rawName)}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex gap-1.5 items-center">
                            <span className="text-slate-500 font-bold text-[10px]">{index + 1}.</span>
                            <span className={index < 5 ? "text-white font-bold text-[11px]" : "text-slate-300 font-medium text-[11px]"}>{item.name}</span>
                          </div>
                          <span className="font-bold text-[11px]" style={{ color }}>{item.cases}</span>
                        </div>
                        <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(item.cases / maxCases) * 100}%`, backgroundColor: color }} />
                        </div>
                        <div className="text-[8px] text-red-500/90 font-bold mt-0.5 tracking-wider uppercase">Dom: {getDominantIdeology(item.ideologies)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {selectedProvince && detailData && (
            <div className="flex flex-col animate-in slide-in-from-right-4 duration-300 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
              
              <div className="flex justify-between items-start px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-amber-500 font-bold text-[9px] tracking-widest uppercase">DETAIL WILAYAH</span>
                  <span className="text-white font-bold text-sm">{detailData.name}</span>
                </div>
                <div className="flex gap-2 text-slate-500">
                  <X className="size-4 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedProvince(null)} />
                </div>
              </div>

              <div className="flex flex-col p-4 gap-4">
                <div className="flex flex-col gap-2 border-b border-slate-800/80 pb-4">
                  <span className="text-red-500 font-bold text-[10px] tracking-widest uppercase">KASUS TERORISME</span>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-[10px] font-bold">Total kasus bulan ini</span>
                    <span className="text-2xl font-bold leading-none" style={{ color: getChoroplethColor(detailData.cases) }}>{detailData.cases}</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${(detailData.cases / maxCases) * 100}%`, backgroundColor: getChoroplethColor(detailData.cases) }} />
                  </div>
                  <span className="text-slate-500 text-[9px] font-bold">Rank #{detailData.rank} nasional</span>
                </div>

                <div className="flex flex-col gap-3 pb-2">
                  <span className="text-indigo-400 font-bold text-[10px] tracking-widest uppercase">PERBANDINGAN IDEOLOGI</span>
                  
                  <div className="flex justify-center -mt-2">
                    <RadarChart ideologies={detailData.ideologies} totalCases={detailData.cases} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-1">
                    {Object.entries(detailData.ideologies).map(([ideo, count]) => {
                      if (count === 0 && ideo === "Lainnya") return null; 
                      const color = IDEOLOGY_COLORS[ideo] || "#64748b";
                      const pct = Math.round((count / detailData.cases) * 100);
                      return (
                        <div key={ideo} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                          <span className="text-slate-400 text-[9px] font-bold">{ideo}</span>
                          <span className="text-white text-[9px] font-bold ml-auto">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[9px] text-slate-500 font-bold border-t border-slate-800/80 pt-2 mt-1">
                    Total: <span className="text-slate-300">{detailData.cases} kasus</span> &middot; Dominan: <span style={{ color: IDEOLOGY_COLORS[getDominantIdeology(detailData.ideologies)] }}>{getDominantIdeology(detailData.ideologies)}</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        <MapContainer center={[-2.5, 118]} zoom={5} zoomControl={false} className="w-full h-full z-[10]" style={{ background: '#0a0a0a' }}>
          <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" subdomains="abcd" maxZoom={20} />
          {geoData && <GeoJSON ref={geoJsonLayerRef} data={geoData} style={(f) => getFeatureStyle(f, currentStep)} onEachFeature={onEachProvince} />}
          
          {showCluster && clusterData.map((city) => {
             const domIdeo = Object.keys(city.ideologies).reduce((a, b) => city.ideologies[a] > city.ideologies[b] ? a : b);

             return (
              <Marker key={city.id} position={[city.lat, city.lng]} icon={createPieChartIcon(city)}>
                <Tooltip direction="top" offset={[0, -10]} className="custom-leaflet-tooltip" opacity={1}>
                  <div className="bg-[#0f172a]/95 border border-slate-600 p-3.5 rounded shadow-2xl backdrop-blur-md text-white font-sans w-[220px]">
                    <div className="font-bold text-[13px] mb-0.5">{city.name}</div>
                    <div className="text-slate-400 text-[10px] mb-3">{city.prov} &middot; <span className="font-bold" style={{color: IDEOLOGY_COLORS[domIdeo]}}>{domIdeo} dom.</span></div>
                    
                    <div className="flex flex-col gap-2.5 mb-3">
                      {Object.entries(city.ideologies).map(([ideo, count]) => {
                        const pct = ((count / city.total) * 100).toFixed(0);
                        const color = IDEOLOGY_COLORS[ideo];
                        return (
                          <div key={ideo} className="flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[11px] font-bold" style={{color}}>{ideo}</span>
                              <span className="text-[10px] text-slate-300"><span className="text-white font-bold">{count}</span> ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="text-slate-400 text-[10px] pt-2 border-t border-slate-700/50">
                      Total kasus terdata: <span className="text-white font-bold">{city.total}</span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="flex items-center px-4 py-1.5 bg-[#070d1a] border-t border-slate-800 h-12">
        <div className="flex items-center gap-3 pr-5 border-r border-slate-800 h-full">
          <button onClick={() => setCurrentStep(0)} className="p-1 border border-slate-700 rounded text-slate-400 hover:text-white hover:border-slate-500 transition-colors"><SkipBack className="size-3.5" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-1.5 px-3 py-1 bg-transparent border rounded text-[10px] font-bold tracking-widest transition-colors w-[85px] justify-center ${isPlaying ? 'border-amber-600/50 text-amber-500 hover:bg-amber-900/30' : 'border-teal-600/50 text-teal-400 hover:bg-teal-900/30'}`}>
            {isPlaying ? <><Pause className="size-3 fill-amber-500" /> PAUSE</> : <><Play className="size-3 fill-teal-400" /> PLAY</>}
          </button>
          <div className="flex flex-col items-center w-[60px] justify-center">
            <span className="text-[10px] text-white font-bold tracking-widest leading-none">{currentTimelineInfo.year}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 leading-none">Bulan {currentTimelineInfo.month}</span>
          </div>
        </div>
        <div className="flex-grow flex items-end gap-[1px] px-4 h-full overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {timelineData.map((data) => {
            const isCurrent = currentStep === data.step;
            const heightPct = Math.max((data.totalCases / maxNasionalCases) * 100, 5) + '%'; 
            let bgClass = "bg-slate-700 hover:bg-slate-500";
            if (isCurrent) bgClass = "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10";
            else if (data.isTop3) bgClass = "bg-red-600 hover:bg-red-500"; 
            return <div key={data.step} onClick={() => { setIsPlaying(false); setCurrentStep(data.step); }} className={`w-1 flex-shrink-0 rounded-t-[1px] transition-all duration-300 cursor-pointer ${bgClass}`} style={{ height: heightPct }} title={`${data.month}/${data.year}: ${data.totalCases} Kasus`}></div>
          })}
        </div>
      </div>

    </div>
  );
};

export default MapPanel;