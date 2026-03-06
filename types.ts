
export enum AgentID {
  CHECK_IN = 'CHECK_IN',
  NORMALIZATION = 'NORMALIZATION',
  RISK_TRIAGE = 'RISK_TRIAGE',
  ORCHESTRATOR = 'ORCHESTRATOR',
  COACH = 'COACH',
  CLINICAL_ANALYST = 'CLINICAL_ANALYST'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum AlertChannel {
  VOICE = 'VOICE',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  APP_PUSH = 'APP_PUSH',
  PORTAL_TASK = 'PORTAL_TASK'
}

export interface AlertContent {
  what_happened: string;
  severity: string;
  caregiver_action: string;
  system_next_step: string;
}

export interface AlertDispatch {
  channel: AlertChannel;
  recipient: string;
  content: AlertContent;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'RETRYING';
  timestamp: string;
}

export interface AuditLog {
  timestamp: string;
  event: string;
  channel?: AlertChannel;
  recipient?: string;
  status?: string;
}

export enum BiometricSource {
  DEVICE = 'DEVICE',
  MANUAL = 'MANUAL',
  NURSE = 'NURSE'
}

export enum DataQuality {
  GOOD = 'GOOD',
  POOR = 'POOR',
  MISSING = 'MISSING',
  MANUAL_ENTRY = 'MANUAL_ENTRY'
}

export interface BiometricRecord {
  timestamp: string;
  source: BiometricSource;
  quality: DataQuality;
  measurements: {
    bp_systolic?: number | null;
    bp_diastolic?: number | null;
    spo2?: number | null;
    heart_rate?: number | null;
    glucose_mg_dl?: number | null;
    activity_steps?: number | null;
    sleep_hours?: number | null;
  };
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: 'active' | 'stable' | 'monitoring';
  language?: string;
  livingStatus?: string;
  preferredContact?: string;
  baselineNotes?: string;
  knownRisks?: string[];
  medicalHistory: {
    diagnosis: string;
    medications: string[];
    allergies: string[];
  };
  contacts: {
    name: string;
    relation: string;
    priority: number;
    phone?: string;
    preferredChannel?: string;
  }[];
  biometricHistory?: BiometricRecord[];
  auditTrail?: ClinicalAuditTrail[];
}

export interface FamilyEvent {
  event_type: string;
  timestamp: string;
  caregiver_id: string;
  patient_id: string;
  alert_id?: string;
  appointment_id?: string;
  selected_slot?: string;
  acknowledged?: boolean;
  confirmed?: boolean;
  note?: string;
  reason?: string;
  preferred_time_window?: string;
  observation_type?: string;
  description?: string;
  vital_type?: string;
  value?: string;
  observation?: {
    summary: string;
    symptoms: string[];
    pain_level: number;
    mobility: string;
    notes: string;
  };
  measurements?: {
    bp_systolic?: number | null;
    bp_diastolic?: number | null;
    spo2?: number | null;
    heart_rate?: number | null;
    glucose_mg_dl?: number | null;
  };
  context_note?: string;
  video_assessment_consent?: boolean;
  is_video_call?: boolean;
}

export interface FacialCuesAnalysis {
  video_quality: {
    face_present: boolean;
    lighting: 'good' | 'poor';
    stability: 'stable' | 'unstable';
    flags: string[];
  };
  cues: {
    alertness: {
      level: 'normal' | 'low' | 'impaired';
      description: string;
      confidence: 'low' | 'medium' | 'high';
    };
    engagement: {
      level: 'responsive' | 'slow' | 'non-responsive';
      description: string;
      confidence: 'low' | 'medium' | 'high';
    };
    discomfort: {
      detected: boolean;
      type?: 'grimace' | 'tension' | 'none';
      severity?: 'mild' | 'moderate' | 'severe';
      description: string;
      confidence: 'low' | 'medium' | 'high';
    };
  };
  clinical_summary: string;
  caregiver_message: string;
  suggested_questions: string[];
  triage_impact: 'ESCALATE' | 'MAINTAIN' | 'DE-ESCALATE' | 'NEUTRAL';
  disclaimer: string;
}

export interface TriageRecommendation {
  level: 'NURSE_CALLBACK' | 'CLINICAL_CONSULT' | 'REHAB_FOLLOWUP' | 'EMERGENCY_ESCALATION';
  action: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  details: {
    verification_questions?: string[];
    sla?: string;
    specialty?: string;
    suggested_slots?: string[];
    rehab_goals?: string[];
    exercises?: string[];
    escalation_protocol?: string;
  };
}

export interface HealthReport {
  timestamp: string;
  period: '7-day' | '30-day';
  executive_summary: {
    overall_status: 'stable' | 'monitoring' | 'declining';
    key_changes: string[];
    triage_recommendation: string; // Keep for summary text
  };
  triage_recommendation: TriageRecommendation;
  trends: {
    heart_rate: { resting: number; max: number; trend: string; vs_baseline: string };
    spo2: { min: number; avg: number; below_threshold_count: number; vs_baseline: string };
    activity: { steps_avg: number; active_minutes_avg: number; trend: string; vs_baseline: string };
    sleep: { avg_duration: number; quality_index: number; trend: string };
    bp_glucose?: {
      bp_avg: string;
      glucose_avg: number;
      exceed_threshold_count: number;
      note: string;
    };
  };
  alerts_summary: {
    counts: { low: number; med: number; high: number; urgent: number };
    red_flag_events: string[];
    handling_summary: string;
  };
  adherence: {
    medication_rate: number;
    exercise_rate: number;
    checkin_frequency: number;
    missed_doses: number;
  };
  recommendations: {
    plan_adjustments: string[];
    follow_up: string;
  };
  risk_drivers: {
    biometrics: string[];
    trends: string[];
    adherence: string[];
  };
  baseline_comparison: {
    metric: string;
    current_period_avg: string;
    baseline_period_avg: string;
    change_value: string;
    change_direction: 'up' | 'down' | 'stable';
    consecutive_days: number;
    symptom_correlation: string;
  }[];
}

export interface ClinicalNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  doctor_confirmation_required: boolean;
  confirmed_by?: string;
  confirmation_timestamp?: string;
}

export interface ClinicalNoteTemplate {
  patient_snapshot: {
    age: number;
    conditions: string[];
    medications: string[];
    baseline_risk: string;
  };
  symptoms_timeline: {
    timestamp: string;
    symptom: string;
    onset: string;
    duration: string;
    triggers: string;
    severity: string;
    source: 'check-in' | 'family-note';
  }[];
  biometrics_table: {
    date: string;
    hr?: number;
    spo2?: number;
    bp?: string;
    glucose?: number;
    temp?: number;
    source: BiometricSource;
    quality: DataQuality;
  }[];
  adherence_summary: {
    medication: { name: string; status: 'taken' | 'missed'; note?: string }[];
    rehab: { activity: string; status: 'completed' | 'skipped'; note?: string }[];
  };
  flags_assessment: {
    red_flags: boolean;
    risk_level: RiskLevel;
    triage_level: string;
    drivers: string[];
  };
  action_plan: {
    nurse_callback_outcome?: string;
    referral_appointment?: string;
    follow_up_schedule: string;
    next_checkin_rules: string;
  };
}

export enum ConfirmationAction {
  CONFIRMED = 'CONFIRMED',
  NOT_CONFIRMED = 'NOT_CONFIRMED',
  ADJUST_PLAN = 'ADJUST_PLAN'
}

export interface ClinicalConfirmation {
  action: ConfirmationAction;
  confirmed_by: string;
  timestamp: string;
  notes?: string;
  adjustments?: {
    triage_level?: string;
    thresholds?: string;
    care_plan?: string;
    additional_requests?: string;
  };
}

export interface ClinicalAuditTrail {
  id: string;
  patient_id: string;
  timestamp: string;
  agent_assessment: {
    risk_level: RiskLevel;
    triage_level: string;
  };
  confirmation: ClinicalConfirmation;
}

export interface ClinicalDecisionSupport {
  report: HealthReport;
  clinical_note_template: ClinicalNote;
  full_note_template: ClinicalNoteTemplate;
  triage_logic_applied: string;
  confirmation?: ClinicalConfirmation;
}

export interface AgentResponse {
  agentId: AgentID;
  title: string;
  timestamp: string;
  data: any;
  rawJson: string;
  status: 'pending' | 'completed' | 'error';
}

export interface WorkflowState {
  currentStep: number;
  responses: Record<string, AgentResponse>;
  isLoading: boolean;
  error?: string;
}
