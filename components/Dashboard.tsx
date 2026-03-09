
import React, { useState } from 'react';
import { Patient, BiometricRecord, BiometricSource, DataQuality, ConfirmationAction } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Activity, Heart, Wind, Thermometer, AlertTriangle, CheckCircle2, Clock, History, XCircle, Settings2 } from 'lucide-react';

interface DashboardProps {
  patient: Patient;
  onTriggerScenario: (text: string) => void;
  onInstantAnalysis: () => void;
  isProcessing: boolean;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patient, onTriggerScenario, onInstantAnalysis, isProcessing, onReset }) => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const handlePresetClick = (preset: { label: string, text: string }) => {
    setScenarioInput(preset.text);
    if (preset.label === 'Video-Assisted Assessment') {
      setIsVideoCallActive(true);
    } else {
      setIsVideoCallActive(false);
    }
  };

  const chartData = (patient.biometricHistory || []).map(record => ({
    time: new Date(record.timestamp).toLocaleDateString(),
    bp_sys: record.measurements.bp_systolic,
    bp_dia: record.measurements.bp_diastolic,
    spo2: record.measurements.spo2,
    hr: record.measurements.heart_rate,
    glucose: record.measurements.glucose_mg_dl,
    steps: record.measurements.activity_steps,
  }));

  const latestRecord = patient.biometricHistory?.[patient.biometricHistory.length - 1];

  const PRESETS = [
    { 
      label: 'Chest Tightness', 
      text: "(Phone check-in)\nBot: Good morning. How are you feeling today?\nPatient: A bit tired… and my chest feels tight when I walk to the kitchen.\nBot: On a scale of 0 to 10, how uncomfortable is it?\nPatient: Maybe 7.\nBot: Did you take your medicine today?\nPatient: I forgot this morning.\nBot: Any shortness of breath?\nPatient: Yes, a little when I climb stairs.\nBot: Thank you. We will inform your family and a nurse will call you back." 
    },
    { 
      label: 'Post-OP Mobility Issue', 
      text: "Mr. Chen's automated walker sensor triggered a slow-movement alert. IVR Follow-up:\nBot: Hello Mr. Chen, I noticed you are moving a bit slower than usual. Are you in pain?\nPatient: My right hip is very stiff today. It throbs when I try to put weight on it. I don't think I can do my physical therapy exercises this morning.\nBot: Is the area around the cut warm or red?\nPatient: Yes, it looks a bit swollen and redder than yesterday." 
    },
    { 
      label: 'CHF Weight Gain', 
      text: "Smart scale sync for Mr. Singh: Weight increased by 3.5 lbs since yesterday morning.\nBot: Hello Mr. Singh, I see a sudden weight change. How are your ankles feeling?\nPatient: They are very puffy, I can barely get my slippers on. I felt a bit breathless while sleeping last night, had to use three pillows to prop myself up." 
    },
    { 
      label: 'Cognitive Decline / Sundowning', 
      text: "Mrs. Garcia's assisted living pendant activated in the hallway at 9:15 PM.\nPatient: (Confused) I need to find my mother. I think I'm late for work. Where is the bus stop?\nCaregiver: Mrs. Garcia, it's late evening, you're at home.\nPatient: No, this isn't my house. I don't recognize these people. My chest feels a bit fluttery too." 
    },
    { 
      label: 'Morning Dizziness', 
      text: "Voice Call: 'I feel a bit woozy this morning, like the room is spinning when I stand up. I think I forgot my white pill.' The patient denied chest pain but mentioned her legs feel heavier than usual." 
    },
    { 
      label: 'Routine Stability', 
      text: "Daily report: 'Everything is fine today. I slept well. I took all my medications with breakfast. No swelling in my ankles today. I'm going to the community garden later.'" 
    },
    { 
      label: 'Critical Red Flag', 
      text: "Voice Alert: 'I'm having trouble catching my breath even while sitting. My chest feels very tight, like someone is squeezing it. I can't find my inhaler. Please help.'" 
    },
    {
      label: 'No Contact Escalation',
      text: "SYSTEM ALERT: Scheduled IVR check-in for Mr. Thompson (P-ARP-005) failed after 3 attempts. No response from patient phone. Last known location: Bedroom. Fall sensor shows no movement for 4 hours. Triggering escalation protocol."
    },
    {
      label: 'Medication Non-Adherence',
      text: "Smart Pillbox Alert: Mrs. L. (P-ARP-001) has missed her morning Amlodipine dose for 2 consecutive days. Blood pressure trend shows a steady increase (Current: 158/95). Patient reported 'forgetting' during last voice check-in."
    },
    {
      label: 'Post-Stroke Warning',
      text: "Family Observation (Kenji): 'My mother (Mrs. Yamamoto) seems to have more trouble swallowing her lunch today. Her speech is also slightly more slurred than this morning. She says she feels fine but looks very tired.'"
    },
    {
      label: 'Video-Assisted Assessment',
      text: "[VIDEO CALL INITIATED]\nPatient: (On screen) I'm feeling very weak... my chest is heavy.\nBot: I see you. Please stay still. I'm analyzing your vital signs and visual cues.\nPatient: (Grimacing, slow response) It's hard to talk...\nBot: I've noted your discomfort and slow response. I'm escalating this to a nurse immediately."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-600 shadow-sm overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} className="w-12 h-12" alt="patient" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                patient.status === 'active' ? 'bg-red-50 text-red-600 border-red-100' : 
                patient.status === 'stable' ? 'bg-green-50 text-green-600 border-green-100' : 
                'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {patient.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-slate-500 text-sm font-medium">
                <i className="fa-solid fa-cake-candles mr-1 text-slate-300"></i>
                {patient.age}y/o • {patient.gender}
              </p>
              {patient.language && (
                <p className="text-slate-500 text-sm font-medium">
                  <i className="fa-solid fa-language mr-1 text-slate-300"></i>
                  {patient.language}
                </p>
              )}
              {patient.livingStatus && (
                <p className="text-slate-500 text-sm font-medium">
                  <i className="fa-solid fa-house-user mr-1 text-slate-300"></i>
                  {patient.livingStatus}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-slate-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear Workflow
          </button>
          <button 
            onClick={onInstantAnalysis}
            disabled={isProcessing}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold text-sm rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <i className={`fa-solid ${isProcessing ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'}`}></i>
            Instant Analysis
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { 
              label: 'Blood Pressure', 
              value: latestRecord?.measurements.bp_systolic ? `${latestRecord.measurements.bp_systolic}/${latestRecord.measurements.bp_diastolic}` : 'N/A', 
              icon: <Heart className="w-4 h-4" />, 
              color: 'text-rose-500', 
              trend: 'up' 
            },
            { 
              label: 'Oxygen Sat.', 
              value: latestRecord?.measurements.spo2 ? `${latestRecord.measurements.spo2}%` : 'N/A', 
              icon: <Wind className="w-4 h-4" />, 
              color: 'text-blue-500', 
              trend: 'stable' 
            },
            { 
              label: 'Heart Rate', 
              value: latestRecord?.measurements.heart_rate ? `${latestRecord.measurements.heart_rate} bpm` : 'N/A', 
              icon: <Activity className="w-4 h-4" />, 
              color: 'text-amber-500', 
              trend: 'down' 
            },
            { 
              label: 'Activity', 
              value: latestRecord?.measurements.activity_steps ? `${latestRecord.measurements.activity_steps} steps` : 'N/A', 
              icon: <Activity className="w-4 h-4" />, 
              color: 'text-emerald-500', 
              trend: 'up' 
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{stat.label}</span>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                <span className={`text-[10px] font-bold pb-1 ${
                  stat.trend === 'up' ? 'text-rose-500' : stat.trend === 'down' ? 'text-indigo-500' : 'text-slate-400'
                }`}>
                  {stat.trend === 'up' ? '▲ 2%' : stat.trend === 'down' ? '▼ 1%' : '• Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Clinical Baseline</span>
          {patient.baselineNotes ? (
            <p className="text-xs text-slate-600 leading-relaxed mb-3 italic">
              "{patient.baselineNotes}"
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">No baseline notes recorded.</p>
          )}
          {patient.knownRisks && patient.knownRisks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {patient.knownRisks.map((risk, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-100 rounded uppercase">
                   {risk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monitoring & Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Vital Sign Trends (7 Days)
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> BP Sys
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div> HR
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="bp_sys" stroke="#6366f1" fillOpacity={1} fill="url(#colorBp)" strokeWidth={2} />
                <Area type="monotone" dataKey="hr" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-indigo-600" />
            Monitoring Timeline & Data Quality
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {(patient.biometricHistory || []).slice().reverse().map((record, idx) => (
              <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                {idx !== (patient.biometricHistory?.length || 0) - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-[1px] bg-slate-100"></div>
                )}
                <div className={`w-4 h-4 rounded-full mt-1 shrink-0 border-2 border-white shadow-sm ${
                  record.quality === DataQuality.GOOD ? 'bg-emerald-500' : 
                  record.quality === DataQuality.MANUAL_ENTRY ? 'bg-amber-500' : 'bg-rose-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900">
                      {record.source} Data Capture
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {record.measurements.bp_systolic ? `BP: ${record.measurements.bp_systolic}/${record.measurements.bp_diastolic} • ` : ''}
                    {record.measurements.spo2 ? `SpO2: ${record.measurements.spo2}% • ` : ''}
                    {record.measurements.heart_rate ? `HR: ${record.measurements.heart_rate} bpm` : ''}
                  </p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-50 text-[8px] font-black text-slate-400 rounded uppercase border border-slate-100">
                      Quality: {record.quality}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Audit History Section */}
      {patient.auditTrail && patient.auditTrail.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Clinical Audit History (Human-in-the-loop)
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {patient.auditTrail.length} Records Found
            </span>
          </div>
          <div className="space-y-4">
            {patient.auditTrail.map((audit, idx) => (
              <div key={audit.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      audit.confirmation.action === ConfirmationAction.CONFIRMED ? 'bg-emerald-100 text-emerald-600' :
                      audit.confirmation.action === ConfirmationAction.NOT_CONFIRMED ? 'bg-rose-100 text-rose-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {audit.confirmation.action === ConfirmationAction.CONFIRMED && <CheckCircle2 className="w-5 h-5" />}
                      {audit.confirmation.action === ConfirmationAction.NOT_CONFIRMED && <XCircle className="w-5 h-5" />}
                      {audit.confirmation.action === ConfirmationAction.ADJUST_PLAN && <Settings2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                          {audit.confirmation.action.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">•</span>
                        <span className="text-[10px] font-bold text-slate-500">{new Date(audit.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{audit.confirmation.notes || 'No clinical notes provided.'}"
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Verified By</span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-700">
                        {audit.confirmation.confirmed_by}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase">AI Assessment</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        audit.agent_assessment.risk_level === 'HIGH' || audit.agent_assessment.risk_level === 'URGENT' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {audit.agent_assessment.risk_level} • {audit.agent_assessment.triage_level}
                      </span>
                    </div>
                  </div>
                </div>
                
                {audit.confirmation.adjustments && (
                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(audit.confirmation.adjustments).map(([key, val]) => val && (
                      <div key={key}>
                        <span className="text-[8px] font-black text-indigo-500 uppercase block mb-0.5">{key.replace('_', ' ')}</span>
                        <p className="text-[10px] font-bold text-slate-700">{val}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <i className="fa-solid fa-brain text-8xl"></i>
        </div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 bg-indigo-500/30 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-microphone-lines text-indigo-200"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">Simulate Clinical Interaction</h3>
            <p className="text-indigo-300 text-sm">Input raw voice transcript or select a demo scenario to trigger the multi-agent pipeline.</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <textarea
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            placeholder={`Paste a transcript or report for ${patient.name}...`}
            className="w-full h-24 bg-indigo-950/50 border border-indigo-700/50 rounded-xl p-4 text-indigo-100 placeholder:text-indigo-400 focus:outline-none focus:border-indigo-400 transition-all resize-none font-mono text-sm"
          ></textarea>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(p)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border hover:scale-105 ${
                  scenarioInput === p.text 
                  ? 'bg-white text-indigo-900 border-white' 
                  : 'bg-indigo-800 hover:bg-indigo-700 text-indigo-100 border-indigo-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {isVideoCallActive && !isProcessing && (
            <div className="bg-indigo-950/80 border border-indigo-400/30 rounded-2xl p-6 animate-in zoom-in duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                    <i className="fa-solid fa-video text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Video Call Simulation</h4>
                    <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">Waiting for clinician connection...</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-emerald-400 uppercase">Secure Link Active</span>
                </div>
              </div>

              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10 relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581056344415-3abb473d38c1?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover opacity-40 grayscale"
                  alt="Patient Preview"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <i className="fa-solid fa-face-viewfinder text-5xl text-indigo-400/50 mb-4"></i>
                  <p className="text-xs text-indigo-200 font-medium max-w-xs">
                    AI-Assisted Visual Analysis will begin automatically once the session starts.
                  </p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                      <i className="fa-solid fa-microphone text-white text-xs"></i>
                    </div>
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                      <i className="fa-solid fa-video text-white text-xs"></i>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                    End Call
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            disabled={isProcessing || !scenarioInput.trim()}
            onClick={() => onTriggerScenario(scenarioInput)}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
              isProcessing 
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : 'bg-white text-indigo-900 hover:bg-indigo-50 active:scale-[0.98] shadow-lg shadow-indigo-400/20'
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                ORCHESTRATING AGENTS...
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i>
                PROCESS CARE EVENT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
