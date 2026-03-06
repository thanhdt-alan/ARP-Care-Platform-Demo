
import React, { useState } from 'react';
import { AgentID, AgentResponse } from '../types';
import { DEMO_CONFIG } from '../demo_config';

interface AgentTerminalProps {
  responses: Record<string, AgentResponse>;
  activeStep: number;
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ responses, activeStep }) => {
  const [view, setView] = useState<'LOGS' | 'CONFIG'>('LOGS');
  const [selectedAgent, setSelectedAgent] = useState<AgentID>(AgentID.CHECK_IN);

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl flex flex-col h-full border border-slate-800 overflow-hidden min-h-[500px]">
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-slate-400 ml-2 font-mono uppercase tracking-wider">System Explorer</span>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setView('LOGS')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${view === 'LOGS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            LOGS
          </button>
          <button 
            onClick={() => setView('CONFIG')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${view === 'CONFIG' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            CONFIG
          </button>
        </div>
      </div>

      {view === 'LOGS' ? (
        <>
          <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-hide">
            {Object.values(AgentID).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedAgent(id)}
                disabled={!responses[id]}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                  !responses[id] ? 'opacity-30 cursor-not-allowed border-transparent' :
                  selectedAgent === id ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                {id.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 font-mono text-xs overflow-auto">
            {responses[selectedAgent] ? (
              <pre className="text-indigo-300 leading-relaxed whitespace-pre-wrap">
                {responses[selectedAgent].rawJson}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <i className="fa-solid fa-code text-3xl"></i>
                <p className="text-center px-8">Select a completed agent step to view structured JSON output</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 p-6 font-mono text-[10px] overflow-auto text-slate-300 leading-relaxed">
           <h4 className="text-indigo-400 font-bold mb-4 border-b border-slate-800 pb-2 uppercase">ARP Core Demo Configuration</h4>
           <pre className="whitespace-pre-wrap">{JSON.stringify(DEMO_CONFIG, null, 2)}</pre>
        </div>
      )}

      <div className="p-3 bg-black/40 border-t border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            {view === 'CONFIG' ? 'VIEWING SCHEMA' : 'AGENT MONITOR ACTIVE'}
          </span>
          <span className="text-slate-500 uppercase">ARP_DEMO_v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default AgentTerminal;
