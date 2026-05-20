// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardUtama from './pages/DashboardUtama';
import AiHistory from './pages/AiHistory';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-[#020617]">
        
        <Sidebar />
        
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardUtama />} />
            <Route path="/ai-history" element={<AiHistory />} />
            
            <Route 
              path="*" 
              element={
                <div className="flex-1 flex flex-col items-center justify-center h-full text-[#4b6689] font-['Consolas',_monospace]">
                  <h1 className="text-4xl font-bold text-[#22d3ee] mb-2">404</h1>
                  <p className="tracking-widest">HALAMAN DALAM TAHAP PENGEMBANGAN</p>
                </div>
              } 
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;