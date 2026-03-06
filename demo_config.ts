
export const DEMO_CONFIG = {
  "patient_profile_schema": {
    "fields": ["name", "age", "gender", "primary_language", "residence_type", "mobility_status"],
    "example_values": {
      "name": "Mrs. Evelyn Miller",
      "age": 82,
      "gender": "Female",
      "primary_language": "English",
      "residence_type": "Independent Living with Home Care",
      "mobility_status": "Uses walker for long distances"
    }
  },
  "family_contact_schema": {
    "fields": ["relation", "priority", "notification_channel", "availability"],
    "example_values": [
      {
        "relation": "Daughter",
        "name": "Sarah Miller",
        "priority": 1,
        "notification_channel": "SMS/Push",
        "availability": "24/7 for Emergencies"
      },
      {
        "relation": "Neighbor",
        "name": "David Grant",
        "priority": 2,
        "notification_channel": "Voice Call",
        "availability": "Daytime only"
      }
    ]
  },
  "medical_history_schema": {
    "fields": ["primary_diagnosis", "comorbidities", "allergies", "current_medications", "surgical_history"],
    "example_values": {
      "primary_diagnosis": "Congestive Heart Failure (NYHA Class II)",
      "comorbidities": ["Osteoarthritis", "Mild Cognitive Impairment"],
      "allergies": ["Penicillin", "Latex"],
      "current_medications": ["Lisinopril 10mg", "Furosemide 20mg", "Atorvastatin 40mg"],
      "surgical_history": ["Hip replacement (2019)", "Cataract surgery (2021)"]
    }
  },
  "daily_check_in_questions": [
    "How would you rate your energy levels this morning compared to yesterday?",
    "Have you experienced any shortness of breath while sitting or walking?",
    "Did you take your prescribed morning medications today?",
    "Are you noticing any new or worsening swelling in your feet or ankles?",
    "Have you felt dizzy, lightheaded, or confused at any point today?",
    "How did you sleep last night? Any interruptions or difficulty breathing lying flat?",
    "Are you planning to have visitors or go out today?"
  ],
  "red_flag_rules": {
    "urgent_triggers": [
      "Chest pain or pressure",
      "Severe shortness of breath at rest",
      "Sudden facial drooping or slurred speech",
      "Loss of consciousness or fainting",
      "Severe pain (10/10)",
      "Sudden confusion or disorientation"
    ],
    "thresholds": {
      "weight_gain": ">2 lbs in 24 hours (CHF risk)",
      "blood_pressure_systolic": ">160 or <90",
      "oxygen_saturation": "<92%"
    }
  },
  "triage_levels": {
    "SELF_MONITOR": {
      "criteria": "Stable vitals, minor or no complaints, 100% med adherence.",
      "actions": ["Log event", "Send positive reinforcement via Care Coach", "Next check-in in 24h"]
    },
    "NURSE_CALLBACK": {
      "criteria": "Mild symptom changes (e.g. minor swelling), missed 1 dose of non-critical med.",
      "actions": ["Notify ARP Home Nurse", "Schedule callback within 4h", "Advise patient to rest"]
    },
    "CLINICAL_FOLLOWUP": {
      "criteria": "Persistent symptoms, weight trend up, confusion noted by family.",
      "actions": ["Notify GP/PCP", "Request telehealth slot within 24h", "Mobilize primary family contact"]
    },
    "EMERGENCY_ESCALATION": {
      "criteria": "Red flags present, acute respiratory distress, severe vitals abnormal.",
      "actions": ["Trigger Emergency Response (EMS)", "Immediate Voice Call to Family", "Open continuous audio monitoring"]
    }
  },
  "service_catalog": {
    "GP": "General medical oversight and medication adjustment.",
    "CARDIOLOGY": "Specialized CHF management and cardiac imaging.",
    "REHAB_THERAPIST": "Post-surgical recovery and fall prevention exercises.",
    "NUTRITIONIST": "Low-sodium diet planning for fluid management.",
    "PSYCHOLOGIST": "Mental health support and cognitive stimulation.",
    "HOME_NURSE": "In-person vitals check and wound care."
  },
  "sla_targets": {
    "EMERGENCY_ESCALATION": "Immediate ( < 2 minutes)",
    "CLINICAL_FOLLOWUP": "Within 12-24 hours",
    "NURSE_CALLBACK": "Within 4 hours",
    "SELF_MONITOR": "Routine (24 hour cycle)"
  }
};

export const FAMILY_APP_CONFIG = {
  "dashboard_widgets": [
    {
      "name": "Safety Status",
      "purpose": "Real-time risk assessment overview and emergency status",
      "fields": ["risk_score", "triage_level", "last_updated"]
    },
    {
      "name": "Health Trends",
      "purpose": "Visual tracking of vital signs over 7 and 30 day periods",
      "fields": ["blood_pressure_chart", "oxygen_saturation_trend", "mobility_index"]
    },
    {
      "name": "Medication Tracker",
      "purpose": "Adherence monitoring and reminder history",
      "fields": ["daily_compliance_rate", "missed_dose_alerts", "next_scheduled_meds"]
    },
    {
      "name": "Upcoming Appointments",
      "purpose": "Scheduling and staff assignment view",
      "fields": ["appointment_time", "staff_name", "staff_role", "confirmation_status"]
    }
  ],
  "screens": {
    "HOME_DASHBOARD": {
      "title": "Home",
      "actions": ["acknowledge_active_alert", "view_safety_index"]
    },
    "ALERTS_INBOX": {
      "title": "Alerts & Notifications",
      "actions": ["ack_alert", "escalate_to_nurse"]
    },
    "PATIENT_TIMELINE": {
      "title": "Care History",
      "actions": ["filter_by_event_type", "export_log"]
    },
    "MEDICATION_ADHERENCE": {
      "title": "Medications",
      "actions": ["log_manually", "set_reminders"]
    },
    "APPOINTMENTS": {
      "title": "Care Schedule",
      "actions": ["confirm_slot", "request_reschedule"]
    },
    "CARE_PLAN": {
      "title": "Daily Coach",
      "actions": ["mark_task_done", "view_micro_goals"]
    }
  },
  "event_schema": {
    "ACK_ALERT": {
      "description": "Acknowledging a triage alert from the dashboard",
      "payload": {
        "alert_id": "string",
        "acknowledged_by": "string",
        "response_note": "string"
      }
    },
    "ADD_OBSERVATION": {
      "description": "Family adding a non-clinical observation (e.g. 'seems more tired')",
      "payload": {
        "observation_type": "behavioral | physical | mood",
        "description": "string",
        "severity": "1-5"
      }
    },
    "UPLOAD_MEASUREMENT": {
      "description": "Manual entry of vital signs from home devices",
      "payload": {
        "vital_type": "BP | SPO2 | GLUCOSE | TEMP",
        "value": "string",
        "timestamp": "ISO_DATE"
      }
    },
    "CONFIRM_APPOINTMENT": {
      "description": "Confirming a suggested telehealth or home visit slot",
      "payload": {
        "slot_id": "string",
        "confirmed": "boolean"
      }
    },
    "REQUEST_NURSE_CALLBACK": {
      "description": "On-demand request for clinical support",
      "payload": {
        "reason": "string",
        "urgency": "low | medium | high"
      }
    }
  },
  "event_mapping": {
    "ACK_ALERT": {
      "consumers": ["ORCHESTRATOR"],
      "system_effect": "Updates case priority and clears family notification flags."
    },
    "ADD_OBSERVATION": {
      "consumers": ["NORMALIZATION", "RISK_TRIAGE"],
      "system_effect": "Adds context to risk score calculation and clinician handover."
    },
    "UPLOAD_MEASUREMENT": {
      "consumers": ["NORMALIZATION", "RISK_TRIAGE"],
      "system_effect": "Triggers immediate re-assessment of current triage level."
    },
    "CONFIRM_APPOINTMENT": {
      "consumers": ["ORCHESTRATOR"],
      "system_effect": "Locks schedule in staff calendar and triggers SLA tracking."
    },
    "REQUEST_NURSE_CALLBACK": {
      "consumers": ["ORCHESTRATOR", "RISK_TRIAGE"],
      "system_effect": "Creates an urgent Case ID and routes to available staff pool."
    }
  }
};
