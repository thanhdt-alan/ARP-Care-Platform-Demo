
import React from 'react';

interface HeaderProps {
  view: 'ADMIN' | 'FAMILY';
  setView: (v: 'ADMIN' | 'FAMILY') => void;
}

const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors duration-500 ${view === 'FAMILY' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
          <i className={`fa-solid ${view === 'FAMILY' ? 'fa-people-roof' : 'fa-house-medical'} text-white text-xl`}></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">ARP Care Platform</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{view === 'FAMILY' ? 'Family Caregiver Portal' : 'Clinical Orchestration Engine'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('ADMIN')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            STAFF VIEW
          </button>
          <button 
            onClick={() => setView('FAMILY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'FAMILY' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            FAMILY APP
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-bell"></i>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300 hidden md:block">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${view === 'FAMILY' ? 'Caregiver' : 'Nurse'}`} alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
