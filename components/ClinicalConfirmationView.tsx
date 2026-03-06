
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Settings2, 
  UserCheck, 
  AlertCircle,
  Save,
  History,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ConfirmationAction, ClinicalConfirmation } from '../types';

interface ClinicalConfirmationViewProps {
  onConfirm: (confirmation: ClinicalConfirmation) => void;
  existingConfirmation?: ClinicalConfirmation;
}

const ClinicalConfirmationView: React.FC<ClinicalConfirmationViewProps> = ({ onConfirm, existingConfirmation }) => {
  const [action, setAction] = useState<ConfirmationAction | null>(existingConfirmation?.action || null);
  const [notes, setNotes] = useState(existingConfirmation?.notes || '');
  const [adjustments, setAdjustments] = useState(existingConfirmation?.adjustments || {
    triage_level: '',
    thresholds: '',
    care_plan: '',
    additional_requests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(!!existingConfirmation);

  const handleSubmit = () => {
    if (!action) return;
    
    const confirmation: ClinicalConfirmation = {
      action,
      confirmed_by: 'Dr. ARP Admin', // Demo user
      timestamp: new Date().toISOString(),
      notes,
      adjustments: action === ConfirmationAction.ADJUST_PLAN ? adjustments : undefined
    };
    
    onConfirm(confirmation);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const conf = existingConfirmation || {
      action: action!,
      confirmed_by: 'Dr. ARP Admin',
      timestamp: new Date().toISOString(),
      notes
    };

    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Clinical Confirmation Recorded</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Human-in-the-loop validation complete</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Verified By</p>
            <p className="text-xs font-bold text-slate-700">{conf.confirmed_by}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-emerald-100">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Status</span>
            <div className="flex items-center gap-2">
              {conf.action === ConfirmationAction.CONFIRMED && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {conf.action === ConfirmationAction.NOT_CONFIRMED && <XCircle className="w-4 h-4 text-rose-500" />}
              {conf.action === ConfirmationAction.ADJUST_PLAN && <Settings2 className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-black text-slate-900 uppercase">{conf.action.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 col-span-2">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Clinical Notes / Rationale</span>
            <p className="text-xs text-slate-600 italic">"{conf.notes || 'No notes provided.'}"</p>
          </div>
        </div>

        {conf.adjustments && (
          <div className="mt-4 bg-white p-4 rounded-2xl border border-emerald-100">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-3">Plan Adjustments Applied</span>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(conf.adjustments).map(([key, val]) => val && (
                <div key={key}>
                  <span className="text-[8px] font-black text-indigo-500 uppercase block">{key.replace('_', ' ')}</span>
                  <p className="text-[10px] font-bold text-slate-700">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase">
            <History className="w-3 h-3" />
            Audit Trail: {new Date(conf.timestamp).toLocaleString()}
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-[9px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-colors"
          >
            Edit Confirmation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 px-8 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-black uppercase tracking-widest">Clinical Confirmation Workflow</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Awaiting Human Review</span>
        </div>
      </div>

      <div className="p-8">
        <p className="text-xs text-slate-500 mb-8 leading-relaxed">
          Please review the AI-generated Clinical Note and Triage recommendations. Your confirmation will update the patient's baseline and care plan parameters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setAction(ConfirmationAction.CONFIRMED)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
              action === ConfirmationAction.CONFIRMED 
                ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action === ConfirmationAction.CONFIRMED ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-slate-900 uppercase block">Confirmed</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Agree with Assessment</span>
            </div>
          </button>

          <button 
            onClick={() => setAction(ConfirmationAction.NOT_CONFIRMED)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
              action === ConfirmationAction.NOT_CONFIRMED 
                ? 'bg-rose-50 border-rose-500 shadow-lg shadow-rose-500/10' 
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action === ConfirmationAction.NOT_CONFIRMED ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-slate-900 uppercase block">Not Confirmed</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">False Alarm / Insufficient</span>
            </div>
          </button>

          <button 
            onClick={() => setAction(ConfirmationAction.ADJUST_PLAN)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
              action === ConfirmationAction.ADJUST_PLAN 
                ? 'bg-amber-50 border-amber-500 shadow-lg shadow-amber-500/10' 
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action === ConfirmationAction.ADJUST_PLAN ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Settings2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-slate-900 uppercase block">Adjust Plan</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Modify Triage / Care Plan</span>
            </div>
          </button>
        </div>

        {action === ConfirmationAction.ADJUST_PLAN && (
          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Define Plan Adjustments</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Adjust Triage Level</label>
                <input 
                  type="text" 
                  value={adjustments.triage_level}
                  onChange={(e) => setAdjustments({...adjustments, triage_level: e.target.value})}
                  placeholder="e.g. Downgrade to Routine"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Adjust Thresholds</label>
                <input 
                  type="text" 
                  value={adjustments.thresholds}
                  onChange={(e) => setAdjustments({...adjustments, thresholds: e.target.value})}
                  placeholder="e.g. Set SpO2 baseline to 92%"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Care Plan / Medication Updates</label>
                <textarea 
                  value={adjustments.care_plan}
                  onChange={(e) => setAdjustments({...adjustments, care_plan: e.target.value})}
                  placeholder="e.g. Increase Metformin dose, add daily weight check"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-20 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Clinical Notes / Audit Reason</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide clinical rationale for your decision..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
              <ShieldCheck className="w-4 h-4" />
              Secure Audit Trail Enabled
            </div>
            <button 
              onClick={handleSubmit}
              disabled={!action}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                action 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Confirmation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalConfirmationView;
