
import React from 'react';
import { FacialCuesAnalysis } from '../types';
import { 
  Video, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Eye, 
  MessageSquare, 
  ShieldAlert,
  HelpCircle,
  VideoOff,
  Zap
} from 'lucide-react';

interface FacialCuesViewProps {
  analysis: FacialCuesAnalysis;
}

const FacialCuesView: React.FC<FacialCuesViewProps> = ({ analysis }) => {
  const { video_quality, cues, clinical_summary, caregiver_message, suggested_questions, triage_impact, disclaimer } = analysis;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'ESCALATE': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'DE-ESCALATE': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'MAINTAIN': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Simulated Video Feed Section */}
      <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
        {/* Placeholder for Video */}
        <img 
          src="https://images.unsplash.com/photo-1581056344415-3abb473d38c1?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
          alt="Video Feed"
          referrerPolicy="no-referrer"
        />
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-1 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] absolute top-0 animate-scan" />
        </div>

        {/* AI Bounding Boxes (Simulated) */}
        {video_quality.face_present && (
          <>
            {/* Face Box */}
            <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-indigo-500/40 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <div className="absolute -top-6 left-0 bg-indigo-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter text-white">
                Patient_ID: P-ARP-001
              </div>
            </div>
            
            {/* Eyes Analysis */}
            <div className="absolute top-[35%] left-[38%] w-8 h-4 border border-emerald-500/50 rounded-full" />
            <div className="absolute top-[35%] left-[54%] w-8 h-4 border border-emerald-500/50 rounded-full" />
            
            {/* Mouth Analysis (Discomfort detection) */}
            <div className={`absolute top-[60%] left-[44%] w-12 h-6 border rounded-full transition-colors ${cues.discomfort.detected ? 'border-rose-500/60 bg-rose-500/10' : 'border-emerald-500/50'}`} />
          </>
        )}

        {/* Overlay Info */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Analysis</span>
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-mono text-indigo-300 border border-indigo-500/20">
            FPS: 24.2 | LATENCY: 42ms
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 m-4" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 m-4" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 m-4" />
      </div>

      {/* Header & Video Quality */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Video-Assisted Assessment</h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Facial Cues Analysis</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getImpactColor(triage_impact)}`}>
            <Zap className="w-3 h-3" />
            Triage Impact: {triage_impact}
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {video_quality.face_present ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VideoOff className="w-4 h-4 text-rose-500" />
            )}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Face Presence</p>
              <p className="text-xs font-bold text-slate-700">{video_quality.face_present ? 'Detected in Frame' : 'Not Detected'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={video_quality.lighting === 'good' ? 'text-emerald-500' : 'text-amber-500'}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Lighting Quality</p>
              <p className="text-xs font-bold text-slate-700 uppercase">{video_quality.lighting}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={video_quality.stability === 'stable' ? 'text-emerald-500' : 'text-rose-500'}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Video Stability</p>
              <p className="text-xs font-bold text-slate-700 uppercase">{video_quality.stability}</p>
            </div>
          </div>
        </div>

        {video_quality.flags.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <div className="flex flex-wrap gap-2">
              {video_quality.flags.map((f, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Observation Cues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alertness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <span className={`text-[10px] font-black uppercase ${getConfidenceColor(cues.alertness.confidence)}`}>
              {cues.alertness.confidence} Conf.
            </span>
          </div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alertness Level</h4>
          <p className={`text-sm font-bold mb-2 uppercase ${
            cues.alertness.level === 'normal' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {cues.alertness.level}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{cues.alertness.description}"
          </p>
        </div>

        {/* Engagement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <span className={`text-[10px] font-black uppercase ${getConfidenceColor(cues.engagement.confidence)}`}>
              {cues.engagement.confidence} Conf.
            </span>
          </div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</h4>
          <p className={`text-sm font-bold mb-2 uppercase ${
            cues.engagement.level === 'responsive' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {cues.engagement.level}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{cues.engagement.description}"
          </p>
        </div>

        {/* Discomfort */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <span className={`text-[10px] font-black uppercase ${getConfidenceColor(cues.discomfort.confidence)}`}>
              {cues.discomfort.confidence} Conf.
            </span>
          </div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visible Discomfort</h4>
          <p className={`text-sm font-bold mb-2 uppercase ${
            cues.discomfort.detected ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {cues.discomfort.detected ? `${cues.discomfort.severity} ${cues.discomfort.type}` : 'None Detected'}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{cues.discomfort.description}"
          </p>
        </div>
      </div>

      {/* Clinical Summary & Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-600" />
            Clinical-Facing Summary
          </h4>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <p className="text-xs text-slate-700 leading-relaxed">
              {clinical_summary}
            </p>
          </div>
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <HelpCircle className="w-3 h-3" />
            Recommended Verification Questions
          </h5>
          <ul className="space-y-2">
            {suggested_questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <MessageSquare className="w-16 h-16" />
          </div>
          <h4 className="font-bold flex items-center gap-2 mb-4 relative z-10">
            <UserCheck className="w-5 h-5 text-indigo-300" />
            Caregiver-Facing Message
          </h4>
          <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-700/50 mb-6 relative z-10">
            <p className="text-sm text-indigo-100 italic leading-relaxed">
              "{caregiver_message}"
            </p>
          </div>
          <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 relative z-10">
            <AlertCircle className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-200 leading-relaxed">
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCheck: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export default FacialCuesView;
