
import React from 'react';
import { Patient } from '../types';

interface SidebarProps {
  patients: Patient[];
  selectedId: string;
  onSelect: (p: Patient) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ patients, selectedId, onSelect }) => {
  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Patient Registry</h2>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {patients.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
              selectedId === p.id 
                ? 'bg-indigo-50 border border-indigo-100' 
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedId === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
              }`}>
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className={`font-semibold text-sm truncate ${selectedId === p.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {p.name}
                  </p>
                  {p.language && (
                    <span className="px-1 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded uppercase border border-slate-200">
                      {p.language}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{p.condition}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                p.status === 'active' ? 'bg-red-400' : p.status === 'stable' ? 'bg-green-400' : 'bg-amber-400'
              }`}></div>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs font-medium text-slate-400 mb-2">Connected Devices</p>
          <div className="flex items-center gap-2 mb-3">
            <i className="fa-solid fa-phone-volume text-indigo-400"></i>
            <span className="text-sm font-semibold">Active IVR Line</span>
          </div>
          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
            CONFIGURE GATEWAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
