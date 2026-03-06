
import React, { useState } from 'react';
import { Patient, WorkflowState, AgentID, FamilyEvent } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Wind, Calendar, Bell, ClipboardList, TrendingUp } from 'lucide-react';

interface FamilyAppProps {
  patient: Patient;
  workflow: WorkflowState;
  onTriggerAction: (scenario: string, event?: FamilyEvent) => void;
  isLoading: boolean;
}

const FamilyApp: React.FC<FamilyAppProps> = ({ patient, workflow, onTriggerAction, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'ALERTS' | 'VITALS' | 'PLAN'>('HOME');
  const [showInputModal, setShowInputModal] = useState<'VITAL' | 'OBSERVATION' | null>(null);
  const [measurement, setMeasurement] = useState({ type: 'BP', value: '' });
  const [observation, setObservation] = useState({ type: 'behavioral', text: '' });

  const chartData = (patient.biometricHistory || []).map(record => ({
    time: new Date(record.timestamp).toLocaleDateString(),
    bp_sys: record.measurements.bp_systolic,
    hr: record.measurements.heart_rate,
    spo2: record.measurements.spo2,
  }));

  const coachResponse = workflow.responses[AgentID.COACH]?.data;
  const familyUI = coachResponse?.family_app_ui;
  const triageResponse = workflow.responses[AgentID.RISK_TRIAGE]?.data;

  // Rich Fallbacks for demo-ready initial state
  const homeData = familyUI?.home_dashboard || {
    today_status_card: { title: "Monitoring Active", subtitle: "All systems operational", status_color: "emerald" },
    risk_level_card: { score: triageResponse?.risk_score || 12, label: triageResponse?.triage_level || "Standard Monitoring", recommendation: "Daily routine check-ins are proceeding normally. No immediate action required." },
    quick_actions: [
      { label: "Request Nurse Call", action_id: "CALLBACK" },
      { label: "Log Observation", action_id: "OBSERVATION" }
    ],
    trend_summary_7d: { metric: "Care Stability", change: "+5%", insight: "Consistent health patterns detected over the last week." }
  };

  const orchResponse = workflow.responses[AgentID.ORCHESTRATOR]?.data;
  const systemAlerts = orchResponse?.alerts?.filter((a: any) => a.recipient === 'Caregiver' || a.recipient === 'Patient').map((a: any, i: number) => ({
    id: `sys-${i}`,
    title: a.content.what_happened,
    message: `${a.content.caregiver_action}. ${a.content.system_next_step}`,
    timestamp: a.timestamp || 'Just now',
    urgency: a.content.severity?.toLowerCase() === 'urgent' || a.content.severity?.toLowerCase() === 'high' ? 'high' : 'med'
  })) || [];

  const alerts = systemAlerts.length > 0 ? systemAlerts : (familyUI?.alerts_inbox || [
    { id: '1', title: 'Daily Check-in Complete', message: 'The morning automated check-in was successful. Mrs. L reported feeling well.', timestamp: '8:45 AM', urgency: 'low' },
    { id: '2', title: 'Medication Reminder', message: 'Morning dose of Amlodipine was confirmed.', timestamp: '8:15 AM', urgency: 'low' }
  ]);

  const handleAction = (type: string) => {
    let scenario = "";
    let event: FamilyEvent | undefined;

    const baseEvent = {
      timestamp: new Date().toISOString(),
      caregiver_id: "CG-001",
      patient_id: patient.id
    };

    if (type === 'CALLBACK') {
      scenario = `Family requested urgent nurse callback.`;
      event = { 
        ...baseEvent, 
        event_type: 'REQUEST_NURSE_CALLBACK', 
        reason: "She is still short of breath and seems worse than this morning.",
        preferred_time_window: "within 1 hour"
      };
    }
    if (type === 'VITAL_UPLOAD') {
      scenario = `Family uploaded ${measurement.type} measurement: ${measurement.value}`;
      
      const measurements: any = {
        bp_systolic: null,
        bp_diastolic: null,
        spo2: null,
        heart_rate: null,
        glucose_mg_dl: null
      };

      if (measurement.type === 'BP') {
        const parts = measurement.value.split('/');
        measurements.bp_systolic = parseInt(parts[0]) || 120;
        measurements.bp_diastolic = parseInt(parts[1]) || 80;
      } else if (measurement.type === 'SPO2') {
        measurements.spo2 = parseInt(measurement.value) || 98;
      } else if (measurement.type === 'GLUCOSE') {
        measurements.glucose_mg_dl = parseInt(measurement.value) || 100;
      }

      if (measurement.value === 'DEMO_CRITICAL') {
        measurements.bp_systolic = 165;
        measurements.bp_diastolic = 98;
        measurements.spo2 = 92;
        measurements.heart_rate = 108;
      }

      event = { 
        ...baseEvent, 
        event_type: 'UPLOAD_MEASUREMENT',
        measurements,
        context_note: "Measured at home via Family App sync."
      };
    }
    if (type === 'OBSERVATION') { setShowInputModal('OBSERVATION'); return; }
    if (type === 'SUBMIT_OBSERVATION') {
      scenario = `Family added detailed observation: ${observation.text}`;
      event = { 
        ...baseEvent, 
        event_type: 'ADD_OBSERVATION', 
        observation: {
          summary: observation.text,
          symptoms: observation.text.toLowerCase().includes('chest') ? ["chest tightness", "shortness of breath"] : [],
          pain_level: observation.text.toLowerCase().includes('pain') ? 7 : 0,
          mobility: observation.text.toLowerCase().includes('walk') ? "reduced" : "normal",
          notes: `Caregiver noted: ${observation.type} concern.`
        }
      };
    }
    if (type === 'ACKNOWLEDGE') {
      scenario = `Family acknowledged alert.`;
      event = { 
        ...baseEvent, 
        event_type: 'ACK_ALERT', 
        alert_id: "ALERT-123", 
        acknowledged: true, 
        note: "Understood. I will check on her now." 
      };
    }
    if (type === 'CONFIRM_APPOINTMENT') {
      scenario = `Family confirmed appointment.`;
      event = {
        ...baseEvent,
        event_type: 'CONFIRM_APPOINTMENT',
        appointment_id: "APT-889",
        selected_slot: "2024-05-20 15:30",
        confirmed: true
      };
    }
    
    if (scenario) onTriggerAction(scenario, event);
    setShowInputModal(null);
  };

  return (
    <div className="max-w-2xl mx-auto pb-32 px-4">
      {/* Patient Header Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} className="w-12 h-12" alt="patient" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{patient.age}Y • {patient.gender} • {patient.condition}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full animate-pulse ${
          homeData.today_status_card.status_color === 'rose' ? 'bg-rose-500' : 
          homeData.today_status_card.status_color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}></div>
      </div>

      {activeTab === 'HOME' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hero Risk Card */}
          <div className={`bg-gradient-to-br rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-1000 ${
            homeData.today_status_card.status_color === 'rose' ? 'from-slate-900 to-rose-950 shadow-rose-200' :
            homeData.today_status_card.status_color === 'amber' ? 'from-slate-900 to-amber-950 shadow-amber-200' :
            'from-slate-900 to-indigo-950 shadow-indigo-200'
          }`}>
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status: {homeData.today_status_card.title}</span>
                 <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                   {homeData.risk_level_card.label}
                 </div>
               </div>

               <div className="flex items-baseline gap-2">
                 <h3 className="text-6xl font-black tracking-tighter">{homeData.risk_level_card.score}%</h3>
                 <span className="text-lg font-bold opacity-60">Safety Index</span>
               </div>

               <div className="mt-8 bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                 <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                   "{homeData.risk_level_card.recommendation}"
                 </p>
                 <div className="flex gap-3 mt-6">
                    {homeData.quick_actions.map((qa: any, i: number) => (
                      <button 
                        key={i}
                        onClick={() => handleAction(qa.action_id)}
                        className="flex-1 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-black/20"
                      >
                        {qa.label}
                      </button>
                    ))}
                 </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-4 text-indigo-500">
                 <i className="fa-solid fa-chart-line text-lg"></i>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Efficiency</span>
               </div>
               <p className="text-2xl font-black text-slate-800">{homeData.trend_summary_7d.change}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase">{homeData.trend_summary_7d.metric}</p>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-4 text-emerald-500">
                 <i className="fa-solid fa-pills text-lg"></i>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Adherence</span>
               </div>
               <p className="text-2xl font-black text-slate-800">{familyUI?.medication_adherence?.current_rate || '94%'}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Meds Logged</p>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Daily Activity Log</h4>
             <div className="space-y-8 relative">
               <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-50"></div>
               {(familyUI?.patient_timeline || [
                 { event: 'Morning bot check-in completed', time: '8:45 AM', type: 'call' },
                 { event: 'Weight logged: 68.5kg', time: 'Yesterday, 8:00 PM', type: 'vital' },
                 { event: 'Daughter visited residence', time: 'Yesterday, 4:30 PM', type: 'social' }
               ]).map((item: any, i: number) => (
                 <div key={i} className="flex gap-5 group relative z-10">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm shrink-0 ${
                      item.type === 'call' ? 'bg-indigo-50 text-indigo-500' :
                      item.type === 'vital' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      <i className={`fa-solid ${item.type === 'call' ? 'fa-phone' : item.type === 'vital' ? 'fa-heart-pulse' : 'fa-user-group'} text-xs`}></i>
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-700">{item.event}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.time}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'ALERTS' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 px-2">Alerts Inbox</h3>
           {alerts.map((alert: any) => (
             <div key={alert.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                 alert.urgency === 'high' ? 'bg-rose-50 text-rose-500' : 
                 alert.urgency === 'med' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'
               }`}>
                 <i className="fa-solid fa-bell"></i>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                   <span className="text-[10px] font-bold text-slate-400">{alert.timestamp}</span>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed">{alert.message}</p>
                 <div className="mt-4 flex gap-2">
                   <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View Details</button>
                   <button onClick={() => handleAction('ACKNOWLEDGE')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Acknowledge</button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'VITALS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Health Trends
            </h3>
            
            <div className="h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFamilyBp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="bp_sys" stroke="#10b981" fillOpacity={1} fill="url(#colorFamilyBp)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hr" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                <Heart className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-emerald-800 uppercase">Avg BP</p>
                <p className="text-lg font-black text-emerald-900">132/84</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl text-center">
                <Activity className="w-5 h-5 text-rose-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-rose-800 uppercase">Avg HR</p>
                <p className="text-lg font-black text-rose-900">74 bpm</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-center">
                <Wind className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-blue-800 uppercase">Avg SpO2</p>
                <p className="text-lg font-black text-blue-900">96%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Measurement History</h3>
            <div className="space-y-3">
              {(patient.biometricHistory || []).slice().reverse().map((record, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {record.measurements.bp_systolic ? <Heart className="w-5 h-5 text-rose-500" /> : <Activity className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {record.measurements.bp_systolic ? `BP: ${record.measurements.bp_systolic}/${record.measurements.bp_diastolic}` : 
                         record.measurements.activity_steps ? `Steps: ${record.measurements.activity_steps}` : 
                         record.measurements.spo2 ? `SpO2: ${record.measurements.spo2}%` : 'Measurement'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white text-[8px] font-black text-slate-400 rounded-lg border border-slate-200 uppercase">
                    {record.source}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowInputModal('VITAL')} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-2xl">
              + Record Measurement
            </button>
          </div>
        </div>
      )}

      {activeTab === 'PLAN' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-inner">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                   <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Personalized Coach</h4>
                  <p className="text-sm font-bold text-emerald-700 opacity-80">{familyUI?.care_plan?.focus_today || 'Hydration & Mobility Focus'}</p>
                </div>
             </div>
             <p className="text-sm text-slate-700 italic leading-relaxed font-medium bg-white/40 p-5 rounded-2xl border border-white mb-6">
                "{coachResponse?.family_plan?.summary || 'No active plan summary yet.'}"
             </p>
             <div className="space-y-3">
               {(familyUI?.care_plan?.daily_tips || ["Maintain low sodium diet.", "Walk 500 steps indoors.", "Monitor morning ankle swelling."]).map((tip: string, i: number) => (
                 <div key={i} className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <i className="fa-solid fa-circle-check text-emerald-500"></i>
                    <p className="text-xs font-bold text-slate-700">{tip}</p>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Assigned Care Team</h4>
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-200">
                      <i className="fa-solid fa-user-nurse"></i>
                   </div>
                   <div>
                     <p className="text-sm font-black text-slate-800">{familyUI?.appointments?.provider || 'Nurse Practitioner'}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{familyUI?.appointments?.next || 'Weekly Check Scheduled'}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction('CONFIRM_APPOINTMENT')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    Confirm
                  </button>
                  <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-50">
                    <i className="fa-solid fa-video"></i>
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Navigation Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center justify-around z-50 border border-white/10">
         {[
           { id: 'HOME', icon: 'fa-house-chimney', label: 'Home' },
           { id: 'ALERTS', icon: 'fa-bell', label: 'Inbox' },
           { id: 'VITALS', icon: 'fa-heart-pulse', label: 'Health' },
           { id: 'PLAN', icon: 'fa-clipboard-list', label: 'Coach' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 py-4 rounded-[2rem] transition-all flex flex-col items-center gap-1.5 ${activeTab === tab.id ? 'bg-white text-slate-900' : 'text-slate-400'}`}
           >
             <i className={`fa-solid ${tab.icon} text-lg`}></i>
             <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
           </button>
         ))}
      </div>

      {/* Input Modals */}
      {showInputModal === 'VITAL' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">Record Reading</h3>
            <div className="space-y-4">
               <select value={measurement.type} onChange={e => setMeasurement({...measurement, type: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold text-sm">
                 <option value="BP">Blood Pressure</option>
                 <option value="SPO2">SpO2 %</option>
                 <option value="GLUCOSE">Blood Glucose</option>
               </select>
               <input 
                 type="text" 
                 placeholder={measurement.type === 'BP' ? "e.g. 120/80" : "e.g. 98"} 
                 value={measurement.value} 
                 onChange={e => setMeasurement({...measurement, value: e.target.value})} 
                 className="w-full bg-slate-50 border p-4 rounded-2xl font-bold text-sm" 
               />
               <button onClick={() => handleAction('VITAL_UPLOAD')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Sync Measurement</button>
               <button onClick={() => setShowInputModal(null)} className="w-full py-2 text-slate-400 font-bold text-xs uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showInputModal === 'OBSERVATION' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">Add Observation</h3>
            <div className="space-y-4">
               <select value={observation.type} onChange={e => setObservation({...observation, type: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold text-sm">
                 <option value="behavioral">Behavior/Mood</option>
                 <option value="physical">Physical Change</option>
                 <option value="appetite">Appetite/Eating</option>
               </select>
               <textarea placeholder="Describe what you noticed..." value={observation.text} onChange={e => setObservation({...observation, text: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold h-24 resize-none text-sm" />
               <button onClick={() => handleAction('SUBMIT_OBSERVATION')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Post Observation</button>
               <button onClick={() => setShowInputModal(null)} className="w-full py-2 text-slate-400 font-bold text-xs uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl animate-bounce">
              <i className="fa-solid fa-satellite-dish text-2xl"></i>
           </div>
           <p className="mt-8 text-sm font-black text-slate-900 uppercase tracking-[0.4em] text-center">Synchronizing Records...</p>
        </div>
      )}
    </div>
  );
};

export default FamilyApp;
