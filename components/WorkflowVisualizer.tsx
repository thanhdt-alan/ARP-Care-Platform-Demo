
import React from 'react';
import { AgentID, AgentResponse, ClinicalConfirmation } from '../types';
import ClinicalReport from './ClinicalReport';
import ClinicalNoteTemplateView from './ClinicalNoteTemplateView';
import ClinicalConfirmationView from './ClinicalConfirmationView';
import FacialCuesView from './FacialCuesView';

interface WorkflowVisualizerProps {
  currentStep: number;
  responses: Record<string, AgentResponse>;
  isLoading: boolean;
  onConfirmClinical?: (confirmation: ClinicalConfirmation) => void;
}

const AGENT_META = [
  { id: AgentID.CHECK_IN, label: 'Check-in', icon: 'fa-phone-volume', color: 'indigo' },
  { id: AgentID.NORMALIZATION, label: 'Normalize', icon: 'fa-filter', color: 'blue' },
  { id: AgentID.RISK_TRIAGE, label: 'Risk & Triage', icon: 'fa-shield-heart', color: 'rose' },
  { id: AgentID.ORCHESTRATOR, label: 'Orchestrator', icon: 'fa-diagram-project', color: 'amber' },
  { id: AgentID.COACH, label: 'Care Coach', icon: 'fa-graduation-cap', color: 'emerald' },
  { id: AgentID.CLINICAL_ANALYST, label: 'Clinical Analyst', icon: 'fa-file-medical', color: 'indigo' },
];

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ currentStep, responses, isLoading, onConfirmClinical }) => {
  const [viewMode, setViewMode] = React.useState<'report' | 'note' | 'confirmation' | 'facial_cues'>('report');
  const coachResponse = responses[AgentID.COACH];
  const summary = coachResponse?.data?.pipeline_summary;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-network-wired text-indigo-600"></i>
          ARP Care Pipeline Execution
        </h3>
        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest">
            <i className="fa-solid fa-circle-notch animate-spin"></i>
            Pipeline Processing...
          </div>
        )}
      </div>

      <div className="p-8">
        {summary && (
          <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in zoom-in duration-500">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <i className="fa-solid fa-list-check text-sm"></i>
                </div>
                <h4 className="text-indigo-900 font-bold uppercase tracking-wider text-xs">PIPELINE_SUMMARY</h4>
             </div>
             <p className="text-slate-700 text-sm leading-relaxed font-medium">
               {summary}
             </p>
          </div>
        )}

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-[40px] left-[5%] right-[5%] h-1 bg-slate-100 z-0"></div>
          <div 
            className="absolute top-[40px] left-[5%] h-1 bg-indigo-600 z-0 transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, (currentStep - 1) * 18))}%` }}
          ></div>

          <div className="flex justify-between items-start relative z-10">
            {AGENT_META.map((agent, idx) => {
              const status = responses[agent.id] ? 'completed' : currentStep === idx + 1 ? 'active' : 'pending';

              return (
                <div key={agent.id} className="flex flex-col items-center text-center max-w-[120px]">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                    status === 'completed' ? `bg-${agent.color}-600 text-white scale-100` : 
                    status === 'active' ? `bg-white border-4 border-indigo-600 text-indigo-600 scale-110 animate-pulse` : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <i className={`fa-solid ${agent.icon} text-2xl`}></i>
                  </div>
                  <div className="mt-4">
                    <p className={`text-sm font-bold ${status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                      {agent.label}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                      {status === 'completed' ? 'Artifact Ready' : status === 'active' ? 'Executing Step' : 'Queued'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          {(Object.values(responses) as AgentResponse[]).map((resp: AgentResponse) => (
            <div key={resp.agentId} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    resp.agentId === AgentID.RISK_TRIAGE ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {resp.agentId.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-slate-900">{resp.title}</h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">{resp.timestamp}</span>
              </div>
              
              <div className="text-sm text-slate-600 leading-relaxed">
                {renderAgentContent(resp, viewMode, setViewMode, onConfirmClinical)}
              </div>
            </div>
          ))}
          
          {currentStep === 0 && !isLoading && (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <i className="fa-solid fa-robot text-4xl mb-4 opacity-20"></i>
              <p className="font-medium">Configure and run a care pipeline to generate artifacts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderAgentContent = (
  resp: AgentResponse, 
  viewMode: 'report' | 'note' | 'confirmation' | 'facial_cues', 
  setViewMode: React.Dispatch<React.SetStateAction<'report' | 'note' | 'confirmation' | 'facial_cues'>>,
  onConfirmClinical?: (confirmation: ClinicalConfirmation) => void
) => {
  const data = resp.data;
  switch (resp.agentId) {
    case AgentID.CHECK_IN:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block text-[10px] uppercase mb-1">Status & Priority</span>
              <div className="text-xs space-y-1">
                <p><span className="text-slate-400 font-bold uppercase">Contact:</span> {data.contact_status}</p>
                <p><span className="text-slate-400 font-bold uppercase">Priority:</span> {data.initial_priority}</p>
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
              <span className="font-bold text-indigo-900 block text-[10px] uppercase mb-1">Next Action</span>
              <p className="text-xs font-bold text-indigo-700">{data.next_action}</p>
            </div>
          </div>

          {data.facial_cues && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-video text-indigo-500"></i>
                  Video-Assisted Assessment Data
                </h5>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('report')}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${
                      viewMode !== 'facial_cues' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Summary
                  </button>
                  <button 
                    onClick={() => setViewMode('facial_cues')}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all flex items-center gap-2 ${
                      viewMode === 'facial_cues' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white text-indigo-600 shadow-sm hover:bg-indigo-50 animate-pulse'
                    }`}
                  >
                    <i className="fa-solid fa-wand-sparkles"></i>
                    Facial Cues
                  </button>
                </div>
              </div>

              {viewMode === 'facial_cues' ? (
                <FacialCuesView analysis={data.facial_cues} />
              ) : (
                <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-face-smile text-indigo-600"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Facial Cues Detected</p>
                      <p className="text-[10px] text-slate-500">Triage Impact: <span className="font-bold text-indigo-600">{data.facial_cues.triage_impact}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewMode('facial_cues')}
                    className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                  >
                    View Analysis
                  </button>
                </div>
              )}
            </div>
          )}
          
          {data.answers && Object.keys(data.answers).length > 0 && (
            <div className="p-3 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-900 block text-[10px] uppercase mb-2">Extracted Answers</span>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(data.answers).map(([q, a]: [string, any]) => (
                  <div key={q} className="text-[11px] flex gap-2 border-b border-slate-50 last:border-0 pb-1">
                    <span className="font-bold text-slate-500 uppercase shrink-0">{q}:</span>
                    <span className="text-slate-700 italic">"{String(a)}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.red_flags_detected?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.red_flags_detected.map((f: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-black border border-rose-100 rounded uppercase">FLAG: {f}</span>
              ))}
            </div>
          )}
        </div>
      );
    case AgentID.NORMALIZATION:
      const record = data.normalized_record || {};
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-slate-200 p-2 rounded-lg text-xs">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Clinical Symptoms</span>
              <p className="text-slate-700">{record.symptoms || 'No specific symptoms captured'}</p>
            </div>
            <div className="bg-white border border-slate-200 p-2 rounded-lg text-xs grid grid-cols-2 gap-1">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Med Adherence</span>
                <span className="font-semibold">{record.medication_adherence || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Pain Level</span>
                <span className={`font-semibold ${record.pain_level > 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                  {record.pain_level ?? 'N/A'}/10
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Mobility</span>
                <span className="font-semibold text-[10px]">{record.mobility_level || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Sleep</span>
                <span className="font-semibold text-[10px]">{record.sleep_quality || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {record.vitals && Object.entries(record.vitals).map(([k, v]) => (
              <div key={k} className="bg-white border border-slate-200 px-3 py-1 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{k}</span>
                <span className="text-sm font-semibold">{String(v)}</span>
              </div>
            ))}
          </div>

          {data.timeline_entry && (
             <div className="text-[11px] italic bg-blue-50/50 p-2 border-l-2 border-blue-400 flex justify-between items-center">
               <span><span className="font-bold text-blue-700">Timeline:</span> {data.timeline_entry.event || data.timeline_entry}</span>
               <span className="text-[9px] font-mono opacity-60">[{data.timeline_entry.date || 'YYYY-MM-DD'}]</span>
             </div>
          )}

          {data.data_quality_flags?.length > 0 && (
            <div className="flex gap-2 items-center">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 text-[10px]"></i>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quality Flags: {data.data_quality_flags.join(', ')}</span>
            </div>
          )}
        </div>
      );
    case AgentID.RISK_TRIAGE:
      const triageColor = data.severity === 'Urgent' || data.severity === 'High' ? 'rose' : data.severity === 'Medium' ? 'amber' : 'emerald';
      return (
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className={`px-4 py-3 rounded-2xl text-white font-black text-center shrink-0 flex flex-col items-center justify-center min-w-[100px] shadow-lg bg-${triageColor}-600`}>
              <span className="text-[9px] opacity-70 uppercase tracking-tighter">Risk Score</span>
              <span className="text-3xl">{data.risk_score}</span>
              <span className="text-[8px] mt-1 uppercase font-bold">{data.severity}</span>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Triage Decision:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  data.triage_decision === 'Emergency escalation' ? 'bg-rose-100 text-rose-700' :
                  data.triage_decision === 'Nurse callback' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {data.triage_decision}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{data.rationale}</p>
              
              {data.key_drivers && data.key_drivers.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Key Drivers:</span>
                  <div className="flex flex-wrap gap-1">
                    {data.key_drivers.map((driver: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded border border-slate-200">
                        {driver}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
               <span className="text-[9px] font-black text-indigo-800 uppercase block mb-1">Family Summary</span>
               <p className="text-xs text-indigo-900 font-medium italic">"{data.family_summary}"</p>
            </div>
            <div className="bg-slate-800 text-slate-200 rounded-xl p-3">
               <span className="text-[9px] font-black text-indigo-400 uppercase block mb-1">Next Steps</span>
               <ul className="space-y-1">
                 {data.next_steps?.map((step: string, i: number) => (
                   <li key={i} className="text-[10px] flex gap-2">
                     <span className="text-indigo-400 font-bold">•</span>
                     <span>{step}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {data.nurse_callback_questions && data.nurse_callback_questions.length > 0 && (
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded flex items-center justify-center">
                    <i className="fa-solid fa-phone text-[10px]"></i>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification Questions</span>
               </div>
               
               <ul className="space-y-1.5">
                 {data.nurse_callback_questions.map((q: string, i: number) => (
                   <li key={i} className="text-[11px] flex gap-2 text-slate-700">
                     <span className="text-indigo-400 font-bold shrink-0">{i+1}.</span>
                     <span>{q}</span>
                   </li>
                 ))}
               </ul>
            </div>
          )}

          {data.trend_analysis && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-800">
              <span className="font-bold uppercase text-[9px] block mb-1">Trend Analysis</span>
              {data.trend_analysis}
            </div>
          )}
        </div>
      );
    case AgentID.ORCHESTRATOR:
      const caseInfo = data.case || {};
      const snapshot = data.dashboard_snapshot || {};
      return (
        <div className="space-y-6">
          {/* Dashboard Snapshot View */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="px-5 py-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-gauge-high text-indigo-400 text-xs"></i>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Case Dashboard Snapshot</span>
              </div>
              <div className="px-2 py-0.5 bg-slate-700 text-[8px] font-bold text-slate-400 rounded">LIVE PREVIEW</div>
            </div>
            <div className="p-5 grid grid-cols-3 gap-6">
               <div className="col-span-1 space-y-4">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">CASE ID / PRIORITY</span>
                    <p className="text-sm font-bold text-white font-mono">{snapshot.case_id}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block mt-1 ${caseInfo.priority === 'High' || caseInfo.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                      {caseInfo.priority || 'Normal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">INTERVENTION LOGS</span>
                    <div className="space-y-1 mt-1">
                       {snapshot.intervention_logs?.map((log: any, i: number) => (
                         <div key={i} className="text-[9px] text-slate-400 border-l border-slate-700 pl-2">
                           <p className="text-slate-300">{log.action}</p>
                           <p className="opacity-50">{log.timestamp} • {log.staff}</p>
                         </div>
                       )) || <p className="text-[9px] text-slate-600 italic">No logs yet</p>}
                    </div>
                  </div>
               </div>

               <div className="col-span-1 border-x border-slate-800 px-6 space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">RISK & SEVERITY</span>
                      <p className="text-lg font-black text-indigo-400">{snapshot.risk_score}%</p>
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 mb-1">{snapshot.severity}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">TRIAGE DECISION</span>
                    <p className="text-[10px] text-slate-300 font-medium">{snapshot.triage_decision}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">SLA COUNTDOWN</span>
                    <div className="flex items-center gap-2">
                       <i className="fa-solid fa-hourglass-half text-rose-400 text-[10px]"></i>
                       <p className="text-xs font-black text-rose-400">{snapshot.sla_countdown}</p>
                    </div>
                  </div>
               </div>

               <div className="col-span-1 space-y-4">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">NEXT APPOINTMENT</span>
                    <p className="text-xs font-bold text-slate-200">{snapshot.next_appointment_slot || 'Pending'}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">OPEN TASKS</span>
                    <div className="space-y-1 mt-1">
                       {snapshot.open_tasks?.map((t: string, i: number) => (
                         <div key={i} className="flex items-center gap-2 text-[9px] text-slate-400">
                           <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                           <span>{t}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Multi-Channel Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bell text-amber-500 text-xs"></i>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-Channel Alerts</span>
              </div>
              <div className="space-y-2">
                {data.alerts?.map((alert: any, i: number) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${
                          alert.channel === 'VOICE' ? 'bg-blue-100 text-blue-700' :
                          alert.channel === 'SMS' || alert.channel === 'WHATSAPP' ? 'bg-green-100 text-green-700' :
                          alert.channel === 'APP_PUSH' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {alert.channel}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">→ {alert.recipient}</span>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-800">{alert.content.what_happened}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="text-[9px]">
                          <span className="text-slate-400 uppercase font-bold block text-[7px]">Action</span>
                          <span className="text-slate-600 leading-tight">{alert.content.caregiver_action}</span>
                        </div>
                        <div className="text-[9px]">
                          <span className="text-slate-400 uppercase font-bold block text-[7px]">Next Step</span>
                          <span className="text-slate-600 leading-tight">{alert.content.system_next_step}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-[10px] text-slate-400 italic">No alerts generated</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-list-check text-indigo-500 text-xs"></i>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Trail</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase">Time</th>
                      <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase">Event</th>
                      <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.audit_logs?.map((log: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-2 text-[8px] font-mono text-slate-400">{log.timestamp.split('T')[1]?.split('.')[0] || log.timestamp}</td>
                        <td className="px-3 py-2">
                          <p className="text-[9px] font-bold text-slate-700">{log.event}</p>
                          {log.channel && <p className="text-[7px] text-slate-400 uppercase">{log.channel} • {log.recipient}</p>}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-[8px] font-bold ${
                            log.status === 'SENT' || log.status === 'DELIVERED' ? 'text-emerald-600' :
                            log.status === 'FAILED' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    )) || <tr><td colSpan={3} className="px-3 py-4 text-[10px] text-slate-400 italic text-center">No audit logs</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    case AgentID.COACH:
      const familyPlan = data.family_plan || {};
      const teamChecklist = data.care_team_checklist || {};
      const warningSigns = data.warning_signs || [];

      return (
        <div className="space-y-5">
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <i className="fa-solid fa-people-roof"></i>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Family-Friendly Short Plan</h4>
                <p className="text-xs text-emerald-700 font-medium italic">"{familyPlan.summary}"</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const dayKey = `day_${i + 1}`;
                return (
                  <div key={i} className="bg-white border border-emerald-200 rounded-lg p-2 text-center shadow-sm">
                    <span className="text-[8px] font-black text-emerald-400 uppercase block mb-1">Day {i + 1}</span>
                    <p className="text-[9px] font-bold text-slate-700 leading-tight h-12 overflow-hidden overflow-ellipsis">
                      {familyPlan[dayKey] || 'Regular monitoring'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-slate-300">
               <div className="flex items-center gap-2 mb-3">
                 <i className="fa-solid fa-stethoscope text-indigo-400"></i>
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Care-Team Checklist</h4>
               </div>
               <div className="space-y-3">
                 <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Daily Protocol</span>
                    <ul className="space-y-1">
                      {teamChecklist.daily_checks?.map((check: string, i: number) => (
                        <li key={i} className="text-[10px] flex gap-2">
                          <i className="fa-solid fa-circle-check text-indigo-500 mt-0.5"></i>
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Weekly Milestones</span>
                    <ul className="space-y-1">
                      {teamChecklist.milestones?.map((m: string, i: number) => (
                        <li key={i} className="text-[10px] flex gap-2">
                          <i className="fa-solid fa-flag text-amber-500 mt-0.5"></i>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
               </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
               <div className="flex items-center gap-2 mb-3">
                 <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                 <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Escalation Triggers</h4>
               </div>
               <div className="flex flex-wrap gap-2">
                 {warningSigns.map((sign: string, i: number) => (
                   <div key={i} className="flex items-center gap-2 bg-white border border-rose-200 px-3 py-2 rounded-xl shadow-sm text-[10px] font-bold text-rose-700 w-full">
                     <i className="fa-solid fa-bolt-lightning text-rose-400"></i>
                     <span>{sign}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      );
    case AgentID.CLINICAL_ANALYST:
      if (!data?.report) {
        return <div className="p-4 text-xs text-slate-500 italic">Generating clinical report...</div>;
      }
      
      // Ensure viewMode is valid for this agent, default to 'report' if it's 'facial_cues'
      const activeClinicalView = (viewMode === 'report' || viewMode === 'note' || viewMode === 'confirmation') ? viewMode : 'report';

      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
             <button 
               onClick={() => setViewMode('report')}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeClinicalView === 'report' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               Health Report
             </button>
             <button 
               onClick={() => setViewMode('note')}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeClinicalView === 'note' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               Clinical Note Template
             </button>
             <button 
               onClick={() => setViewMode('confirmation')}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                 activeClinicalView === 'confirmation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               <i className={`fa-solid ${data.confirmation ? 'fa-shield-check text-emerald-400' : 'fa-user-check'}`}></i>
               Confirmation Workflow
             </button>
          </div>
          
          {activeClinicalView === 'report' && (
            <ClinicalReport 
              report={data.report} 
              clinicalNote={data.clinical_note_template} 
            />
          )}
          
          {activeClinicalView === 'note' && (
            <ClinicalNoteTemplateView template={data.full_note_template} />
          )}

          {activeClinicalView === 'confirmation' && (
            <ClinicalConfirmationView 
              onConfirm={(conf) => {
                if (onConfirmClinical) onConfirmClinical(conf);
              }} 
              existingConfirmation={data.confirmation}
            />
          )}
        </div>
      );
    default:
      return <pre className="text-[10px] font-mono whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
  }
};

export default WorkflowVisualizer;
