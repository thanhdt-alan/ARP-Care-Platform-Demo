
import React from 'react';
import { ClinicalNoteTemplate, BiometricSource, DataQuality } from '../types';
import { 
  User, 
  Clock, 
  Table, 
  CheckSquare, 
  ShieldAlert, 
  ClipboardList,
  Calendar,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  Stethoscope,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface ClinicalNoteTemplateViewProps {
  template: ClinicalNoteTemplate;
}

const ClinicalNoteTemplateView: React.FC<ClinicalNoteTemplateViewProps> = ({ template }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">Clinical Note Template</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Standardized ARP Documentation</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase">Document Status</p>
          <p className="text-xs font-bold text-emerald-400 uppercase">Draft Generated</p>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* A. Patient Snapshot */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">A. Patient Snapshot</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Age</span>
              <p className="text-lg font-black text-slate-900">{template.patient_snapshot.age} Years</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-1 md:col-span-1">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Baseline Risk</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                template.patient_snapshot.baseline_risk.toLowerCase().includes('high') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {template.patient_snapshot.baseline_risk}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-1 md:col-span-2">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Conditions</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.patient_snapshot.conditions.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-1 md:col-span-4">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Current Medications</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {template.patient_snapshot.medications.map((m, i) => (
                  <span key={i} className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black border border-indigo-100">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* B. Symptoms Timeline */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">B. Symptoms Timeline</h3>
          </div>
          <div className="space-y-3">
            {template.symptoms_timeline.map((s, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-24 shrink-0 pt-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">{s.timestamp.split('T')[0]}</p>
                  <p className="text-[9px] font-bold text-slate-300">{s.timestamp.split('T')[1]?.split('.')[0] || ''}</p>
                </div>
                <div className="relative pb-6 flex-1">
                  {i !== template.symptoms_timeline.length - 1 && (
                    <div className="absolute top-6 bottom-0 left-[-17px] w-0.5 bg-slate-100"></div>
                  )}
                  <div className="absolute top-2 left-[-20px] w-2 h-2 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm group-hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black text-slate-900">{s.symptom}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        s.source === 'check-in' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        Source: {s.source}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Onset</span>
                        <p className="text-[10px] font-bold text-slate-700">{s.onset}</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Duration</span>
                        <p className="text-[10px] font-bold text-slate-700">{s.duration}</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Triggers</span>
                        <p className="text-[10px] font-bold text-slate-700">{s.triggers}</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Severity</span>
                        <span className={`text-[10px] font-black ${
                          s.severity.toLowerCase().includes('high') || s.severity.toLowerCase().includes('severe') ? 'text-rose-600' : 'text-slate-700'
                        }`}>{s.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* C. Biometrics Table */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <Table className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">C. Biometrics Table</h3>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">HR</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">SpO₂</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">BP</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Glucose</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Temp</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Source</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {template.biometrics_table.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-bold text-slate-700">{row.date}</td>
                    <td className="px-4 py-3 text-center text-[10px] font-black text-slate-900">{row.hr || '--'}</td>
                    <td className="px-4 py-3 text-center text-[10px] font-black text-slate-900">{row.spo2 ? `${row.spo2}%` : '--'}</td>
                    <td className="px-4 py-3 text-center text-[10px] font-black text-slate-900">{row.bp || '--'}</td>
                    <td className="px-4 py-3 text-center text-[10px] font-black text-slate-900">{row.glucose || '--'}</td>
                    <td className="px-4 py-3 text-center text-[10px] font-black text-slate-900">{row.temp ? `${row.temp}°C` : '--'}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{row.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        row.quality === DataQuality.GOOD ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {row.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* D. Adherence Summary */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">D. Adherence Summary</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-3">Medication Adherence</span>
                <div className="space-y-2">
                  {template.adherence_summary.medication.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'taken' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="text-[10px] font-bold text-slate-700">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.note && <span className="text-[9px] text-slate-400 italic">"{m.note}"</span>}
                        <span className={`text-[9px] font-black uppercase ${m.status === 'taken' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-3">Rehabilitation / PHCN</span>
                <div className="space-y-2">
                  {template.adherence_summary.rehab.map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="text-[10px] font-bold text-slate-700">{r.activity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.note && <span className="text-[9px] text-slate-400 italic">"{r.note}"</span>}
                        <span className={`text-[9px] font-black uppercase ${r.status === 'completed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* E. Flags & Assessment */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">E. Flags & Assessment</h3>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${template.flags_assessment.red_flags ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest">Red Flags Detected</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${template.flags_assessment.red_flags ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {template.flags_assessment.red_flags ? 'YES' : 'NO'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-600">
                  {template.flags_assessment.red_flags ? 'Immediate clinical attention required for flagged biometrics/symptoms.' : 'No immediate clinical red flags identified in current data.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Risk Level</span>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{template.flags_assessment.risk_level}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Triage Level</span>
                  <p className="text-sm font-black text-indigo-600 uppercase tracking-tight">{template.flags_assessment.triage_level}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Assessment Drivers (Why Flagged)</span>
                <div className="space-y-2">
                  {template.flags_assessment.drivers.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] font-bold text-slate-700">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* F. Action & Plan */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">F. Action & Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <span className="text-[9px] font-black text-indigo-600 uppercase block mb-1">Nurse Callback Outcome</span>
                <p className="text-xs font-bold text-indigo-900 italic">
                  {template.action_plan.nurse_callback_outcome || 'No callback recorded for this period.'}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Referral / Appointment</span>
                <p className="text-xs font-bold text-slate-800">
                  {template.action_plan.referral_appointment || 'No active referrals pending.'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Calendar className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-3">Follow-up Schedule</span>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-black">{template.action_plan.follow_up_schedule}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Next Check-in Rules</span>
                    <p className="text-[10px] font-bold text-slate-300 leading-relaxed">
                      {template.action_plan.next_checkin_rules}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Automated Clinical Synthesis • ARP AI-CDS Engine v2.4
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Export to EMR
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNoteTemplateView;
