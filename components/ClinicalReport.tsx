
import React from 'react';
import { HealthReport, ClinicalNote } from '../types';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Stethoscope, 
  Calendar,
  Activity,
  Heart,
  Wind,
  Moon,
  Pill,
  Bell,
  ShieldAlert,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface ClinicalReportProps {
  report: HealthReport;
  clinicalNote: ClinicalNote;
}

const ClinicalReport: React.FC<ClinicalReportProps> = ({ report, clinicalNote }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Clinical Health Report ({report.period})
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Generated on {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          report.executive_summary.overall_status === 'stable' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          report.executive_summary.overall_status === 'monitoring' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          'bg-rose-50 text-rose-600 border-rose-100'
        }`}>
          Status: {report.executive_summary.overall_status}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Executive Summary
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-indigo-900 font-medium leading-relaxed">
            {report.executive_summary.triage_recommendation}
          </p>
          <div className="flex flex-wrap gap-2">
            {report.executive_summary?.key_changes?.map((change, i) => (
              <span key={i} className="px-2 py-1 bg-white/60 text-[10px] font-bold text-indigo-700 rounded-lg border border-indigo-200">
                • {change}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Triage Recommendation */}
      {report.triage_recommendation && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          report.triage_recommendation.priority === 'urgent' ? 'bg-rose-50 border-rose-200' :
          report.triage_recommendation.priority === 'high' ? 'bg-amber-50 border-amber-200' :
          'bg-indigo-50 border-indigo-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${
                report.triage_recommendation.priority === 'urgent' ? 'text-rose-600' :
                report.triage_recommendation.priority === 'high' ? 'text-amber-600' :
                'text-indigo-600'
              }`} />
              Triage Recommendation: {report.triage_recommendation.level.replace('_', ' ')}
            </h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              report.triage_recommendation.priority === 'urgent' ? 'bg-rose-100 text-rose-700 border-rose-200' :
              report.triage_recommendation.priority === 'high' ? 'bg-amber-100 text-amber-700 border-amber-200' :
              'bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}>
              Priority: {report.triage_recommendation.priority}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-sm font-bold text-slate-800">{report.triage_recommendation.action}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Rationale</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{report.triage_recommendation.reason}</p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-xl p-4 border border-white/40">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Operational Details</p>
              <div className="space-y-3">
                {report.triage_recommendation.level === 'NURSE_CALLBACK' && (
                  <>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Verification Questions</p>
                      <ul className="space-y-1">
                        {report.triage_recommendation.details.verification_questions?.map((q, i) => (
                          <li key={i} className="text-[10px] font-bold text-slate-700 flex items-start gap-2">
                            <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-indigo-600 uppercase">SLA Target:</span>
                      <span className="text-[10px] font-black text-slate-800">{report.triage_recommendation.details.sla}</span>
                    </div>
                  </>
                )}
                
                {report.triage_recommendation.level === 'CLINICAL_CONSULT' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-indigo-600 uppercase">Specialty:</span>
                      <span className="text-[10px] font-black text-slate-800">{report.triage_recommendation.details.specialty}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Suggested Slots</p>
                      <div className="flex flex-wrap gap-2">
                        {report.triage_recommendation.details.suggested_slots?.map((slot, i) => (
                          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-lg border border-indigo-200">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {report.triage_recommendation.level === 'REHAB_FOLLOWUP' && (
                  <>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Rehab Goals</p>
                      <ul className="space-y-1">
                        {report.triage_recommendation.details.rehab_goals?.map((goal, i) => (
                          <li key={i} className="text-[10px] font-bold text-slate-700 flex items-start gap-2">
                            <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Recommended Exercises</p>
                      <p className="text-[10px] font-bold text-slate-700">{report.triage_recommendation.details.exercises?.join(', ')}</p>
                    </div>
                  </>
                )}
                
                {report.triage_recommendation.level === 'EMERGENCY_ESCALATION' && (
                  <div className="bg-rose-100/50 p-3 rounded-lg border border-rose-200">
                    <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Escalation Protocol</p>
                    <p className="text-[10px] font-black text-rose-800">{report.triage_recommendation.details.escalation_protocol}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 italic">
              Disclaimer: This recommendation is for clinical decision support. Final decision rests with ARP medical professionals.
            </p>
          </div>
        </div>
      )}

      {/* Trend Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Heart className="w-3 h-3 text-rose-500" />
            Cardiac & Respiratory Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Heart Rate (Resting)</p>
                <p className="text-lg font-black text-slate-900">{report.trends.heart_rate.resting} bpm</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold flex items-center gap-1 ${report.trends.heart_rate.trend === 'increasing' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {report.trends.heart_rate.trend === 'increasing' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {report.trends.heart_rate.vs_baseline}
                </span>
                <p className="text-[9px] text-slate-400 font-bold uppercase">vs Baseline</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">SpO2 (Average)</p>
                <p className="text-lg font-black text-slate-900">{report.trends.spo2.avg}%</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  {report.trends.spo2.below_threshold_count} drops
                </span>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Below 94%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            Activity & Sleep
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Daily Steps (Avg)</p>
                <p className="text-lg font-black text-slate-900">{report.trends.activity.steps_avg.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold flex items-center gap-1 ${report.trends.activity.trend === 'decreasing' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {report.trends.activity.trend === 'decreasing' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {report.trends.activity.vs_baseline}
                </span>
                <p className="text-[9px] text-slate-400 font-bold uppercase">vs Baseline</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Sleep Duration (Avg)</p>
                <p className="text-lg font-black text-slate-900">{report.trends.sleep.avg_duration}h</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < report.trends.sleep.quality_index ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Quality Index</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adherence & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Pill className="w-3 h-3 text-indigo-500" />
            Care Adherence
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Medications</span>
              <span className="text-sm font-black text-indigo-600">{report.adherence.medication_rate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${report.adherence.medication_rate}%` }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Exercises</span>
              <span className="text-sm font-black text-emerald-600">{report.adherence.exercise_rate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${report.adherence.exercise_rate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Bell className="w-3 h-3 text-amber-500" />
            Alerts Summary
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-rose-50 p-2 rounded-xl text-center">
              <p className="text-lg font-black text-rose-600">{report.alerts_summary.counts.urgent + report.alerts_summary.counts.high}</p>
              <p className="text-[8px] font-black text-rose-400 uppercase">Critical</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <p className="text-lg font-black text-slate-600">{report.alerts_summary.counts.med + report.alerts_summary.counts.low}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase">Routine</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 leading-tight italic">
            {report.alerts_summary.handling_summary}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-indigo-500" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {report.recommendations?.plan_adjustments?.map((rec, i) => (
              <li key={i} className="text-[10px] font-bold text-slate-600 flex items-start gap-2">
                <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                {rec}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Next Step</p>
            <p className="text-[10px] font-bold text-slate-800">{report.recommendations.follow_up}</p>
          </div>
        </div>
      </div>

      {/* Risk Drivers & Baseline Comparison */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Risk Drivers Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">Biometrics Drivers</span>
              <ul className="space-y-2">
                {report.risk_drivers?.biometrics?.map((driver, i) => (
                  <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                    <div className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 shrink-0"></div>
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Trend Drivers</span>
              <ul className="space-y-2">
                {report.risk_drivers?.trends?.map((driver, i) => (
                  <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 shrink-0"></div>
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Adherence Drivers</span>
              <ul className="space-y-2">
                {report.risk_drivers?.adherence?.map((driver, i) => (
                  <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              What Changed vs Baseline (30-Day)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Metric</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Current Avg</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Baseline Avg</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Change</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Duration</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Symptom Correlation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.baseline_comparison?.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.metric}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-700">{item.current_period_avg}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-500">{item.baseline_period_avg}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                        item.change_direction === 'up' ? 'bg-rose-50 text-rose-600' :
                        item.change_direction === 'down' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {item.change_direction === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                         item.change_direction === 'down' ? <ArrowDownRight className="w-3 h-3" /> : 
                         <Minus className="w-3 h-3" />}
                        {item.change_value}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-700">{item.consecutive_days} days</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 italic">"{item.symptom_correlation}"</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Clinical Note Template (SOAP) */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Stethoscope className="w-32 h-32" />
        </div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-lg font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-indigo-400" />
            Clinical Note Template (SOAP)
          </h3>
          {clinicalNote.doctor_confirmation_required && (
            <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[9px] font-black uppercase tracking-widest">
              Doctor Confirmation Required
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Subjective</label>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 italic">
                "{clinicalNote.subjective}"
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Objective</label>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {clinicalNote.objective}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Assessment</label>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {clinicalNote.assessment}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Plan</label>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {clinicalNote.plan}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-black text-white">
              DR
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Doctor Review Workflow</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Pending Clinical Validation</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg shadow-white/10">
            Confirm & Sign Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalReport;
