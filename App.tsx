
import React, { useState } from 'react';
import { callAgent } from './services/gemini';
import { AgentID, WorkflowState, Patient, AgentResponse, FamilyEvent, BiometricRecord, BiometricSource, DataQuality, ClinicalConfirmation, ConfirmationAction, ClinicalAuditTrail, RiskLevel } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorkflowVisualizer from './components/WorkflowVisualizer';
import AgentTerminal from './components/AgentTerminal';
import Header from './components/Header';
import FamilyApp from './components/FamilyApp';

const DEMO_PATIENTS: Patient[] = [
  { 
    id: 'P-ARP-001', 
    name: 'Mrs. L.', 
    age: 76, 
    gender: 'Female',
    condition: 'Hypertension & Type 2 Diabetes Monitoring', 
    status: 'monitoring',
    language: 'Cantonese',
    livingStatus: 'Lives with spouse',
    preferredContact: 'Phone call',
    baselineNotes: 'Usually stable; mild knee pain; independent walking at home.',
    knownRisks: ['Occasional dizziness when standing quickly'],
    medicalHistory: {
      diagnosis: 'Hypertension, Type 2 Diabetes',
      medications: ['Amlodipine (daily)', 'Metformin (daily)'],
      allergies: []
    },
    contacts: [{ 
      name: 'May (Daughter)', 
      relation: 'Daughter', 
      priority: 1,
      phone: '+852-9XXX-XXXX',
      preferredChannel: 'WhatsApp/SMS'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 132, bp_diastolic: 82, spo2: 98, heart_rate: 72 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 135, bp_diastolic: 84, spo2: 97, heart_rate: 74 } },
      { timestamp: '2024-05-17T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 138, bp_diastolic: 86, spo2: 96, heart_rate: 76 } },
    ]
  },
  { 
    id: 'P-ARP-002', 
    name: 'Mr. Chen', 
    age: 82, 
    gender: 'Male',
    condition: 'Post-Hip Surgery Recovery', 
    status: 'active',
    language: 'Mandarin',
    livingStatus: 'Lives alone with visiting care',
    preferredContact: 'IVR Bot',
    baselineNotes: 'Recent total hip replacement (3 weeks ago). Using walker.',
    knownRisks: ['High fall risk', 'Incision site infection risk'],
    medicalHistory: {
      diagnosis: 'Osteoarthritis, Post-OP Hip Replacement',
      medications: ['Warfarin', 'Oxycodone (PRN)', 'Gabapentin'],
      allergies: ['Latex']
    },
    contacts: [{ 
      name: 'Wei (Son)', 
      relation: 'Son', 
      priority: 1,
      phone: '+852-6XXX-XXXX',
      preferredChannel: 'Push Notification'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { activity_steps: 1200, sleep_hours: 7.5, heart_rate: 68 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { activity_steps: 800, sleep_hours: 6.5, heart_rate: 72 } },
      { timestamp: '2024-05-17T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { activity_steps: 400, sleep_hours: 5.0, heart_rate: 78 } },
    ]
  },
  { 
    id: 'P-ARP-003', 
    name: 'Mrs. Garcia', 
    age: 79, 
    gender: 'Female',
    condition: 'Early-Stage Alzheimer\'s & COPD', 
    status: 'monitoring',
    language: 'Spanish',
    livingStatus: 'Assisted Living',
    preferredContact: 'Family Tablet',
    baselineNotes: 'Occasional confusion in the evening (sundowning). Uses supplemental oxygen at night.',
    knownRisks: ['Wandering', 'Shortness of breath'],
    medicalHistory: {
      diagnosis: 'Early-stage Alzheimer\'s, COPD',
      medications: ['Donepezil', 'Albuterol Inhaler', 'Spiriva'],
      allergies: ['Penicillin']
    },
    contacts: [{ 
      name: 'Elena (Daughter)', 
      relation: 'Daughter', 
      priority: 1,
      phone: '+1-555-0199',
      preferredChannel: 'Voice Call'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { spo2: 95, heart_rate: 82 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { spo2: 94, heart_rate: 84 } },
      { timestamp: '2024-05-17T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { spo2: 92, heart_rate: 88 } },
    ]
  },
  { 
    id: 'P-ARP-004', 
    name: 'Mr. Singh', 
    age: 68, 
    gender: 'Male',
    condition: 'Congestive Heart Failure (CHF)', 
    status: 'stable',
    language: 'English',
    livingStatus: 'Lives with daughter',
    preferredContact: 'Smartphone App',
    baselineNotes: 'Strict low-sodium diet. Weighs himself daily.',
    knownRisks: ['Fluid retention', 'Rapid weight gain'],
    medicalHistory: {
      diagnosis: 'Congestive Heart Failure (NYHA Class II)',
      medications: ['Lisinopril', 'Furosemide', 'Carvedilol'],
      allergies: []
    },
    contacts: [{ 
      name: 'Priya (Daughter)', 
      relation: 'Daughter', 
      priority: 1,
      phone: '+44-7700-900',
      preferredChannel: 'WhatsApp'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 128, bp_diastolic: 78, heart_rate: 65 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 130, bp_diastolic: 80, heart_rate: 67 } },
      { timestamp: '2024-05-17T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 132, bp_diastolic: 82, heart_rate: 70 } },
    ]
  },
  {
    id: 'P-ARP-005',
    name: 'Mr. Thompson',
    age: 85,
    gender: 'Male',
    condition: 'Chronic Kidney Disease & Fall Risk',
    status: 'monitoring',
    language: 'English',
    livingStatus: 'Lives alone',
    preferredContact: 'Voice Call',
    baselineNotes: 'History of multiple falls. Requires frequent check-ins.',
    knownRisks: ['Severe fall risk', 'Dehydration risk'],
    medicalHistory: {
      diagnosis: 'CKD Stage 3, Osteoporosis',
      medications: ['Calcitriol', 'Sevelamer'],
      allergies: []
    },
    contacts: [{
      name: 'Robert (Son)',
      relation: 'Son',
      priority: 1,
      phone: '+1-555-0422',
      preferredChannel: 'SMS'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 115, bp_diastolic: 70, heart_rate: 62 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 118, bp_diastolic: 72, heart_rate: 64 } },
    ]
  },
  {
    id: 'P-ARP-006',
    name: 'Mrs. Yamamoto',
    age: 72,
    gender: 'Female',
    condition: 'Post-Stroke Recovery',
    status: 'active',
    language: 'Japanese',
    livingStatus: 'Lives with husband',
    preferredContact: 'Family Tablet',
    baselineNotes: 'Left-side weakness. Speech therapy in progress.',
    knownRisks: ['Aspiration risk', 'Recurrent stroke risk'],
    medicalHistory: {
      diagnosis: 'Ischemic Stroke (6 months ago)',
      medications: ['Clopidogrel', 'Atorvastatin'],
      allergies: []
    },
    contacts: [{
      name: 'Kenji (Son)',
      relation: 'Son',
      priority: 1,
      phone: '+81-90-XXXX-XXXX',
      preferredChannel: 'Push Notification'
    }],
    biometricHistory: [
      { timestamp: '2024-05-15T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 142, bp_diastolic: 88, heart_rate: 70 } },
      { timestamp: '2024-05-16T08:00:00Z', source: BiometricSource.DEVICE, quality: DataQuality.GOOD, measurements: { bp_systolic: 145, bp_diastolic: 90, heart_rate: 72 } },
    ]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'ADMIN' | 'FAMILY'>('ADMIN');
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(DEMO_PATIENTS[0].id);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const [workflow, setWorkflow] = useState<WorkflowState>({
    currentStep: 0,
    responses: {},
    isLoading: false,
  });

  const resetWorkflow = () => {
    setWorkflow({
      currentStep: 0,
      responses: {},
      isLoading: false,
    });
  };

  const handleRunWorkflow = async (scenarioText: string, familyEvent?: FamilyEvent) => {
    setWorkflow(prev => ({ ...prev, isLoading: true, currentStep: 1, responses: {} }));
    
    // Detect if this is a video call scenario
    const isVideoCall = scenarioText.includes('[VIDEO CALL INITIATED]');
    const effectiveFamilyEvent = familyEvent || (isVideoCall ? {
      event_type: 'VIDEO_ASSISTED_ASSESSMENT',
      timestamp: new Date().toISOString(),
      caregiver_id: 'SYSTEM',
      patient_id: selectedPatient?.id || '',
      is_video_call: true,
      video_assessment_consent: true
    } : undefined);

    const currentState = {
      triage: workflow.responses[AgentID.RISK_TRIAGE]?.data,
      case: workflow.responses[AgentID.ORCHESTRATOR]?.data,
      coach: workflow.responses[AgentID.COACH]?.data
    };
    
    try {
      // Step 1: interpretation
      const checkInData = await callAgent(AgentID.CHECK_IN, { 
        patient: selectedPatient, 
        checkinRaw: scenarioText,
        familyEvent: effectiveFamilyEvent,
        currentState
      });
      const checkInResponse: AgentResponse = {
        agentId: AgentID.CHECK_IN,
        title: effectiveFamilyEvent ? `Event: ${effectiveFamilyEvent.event_type}` : 'Step 1: Care Check-in Interpretation',
        timestamp: new Date().toLocaleTimeString(),
        data: checkInData,
        rawJson: JSON.stringify(checkInData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ ...prev, currentStep: 2, responses: { ...prev.responses, [AgentID.CHECK_IN]: checkInResponse } }));

      // Step 2: normalization
      const normData = await callAgent(AgentID.NORMALIZATION, { 
        patient: selectedPatient, 
        previousContext: checkInData,
        currentState
      });
      const normResponse: AgentResponse = {
        agentId: AgentID.NORMALIZATION,
        title: 'Step 2: Data Normalization',
        timestamp: new Date().toLocaleTimeString(),
        data: normData,
        rawJson: JSON.stringify(normData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ ...prev, currentStep: 3, responses: { ...prev.responses, [AgentID.NORMALIZATION]: normResponse } }));

      // Update Patient History with new normalized biometric record if available
      if (normData.normalized_record && normData.normalized_record.vitals) {
        const newRecord: BiometricRecord = {
          timestamp: new Date().toISOString(),
          source: normData.normalized_record.source as BiometricSource || BiometricSource.NURSE,
          quality: normData.normalized_record.quality as DataQuality || DataQuality.GOOD,
          measurements: normData.normalized_record.vitals
        };
        
        setPatients(prev => prev.map(p => 
          p.id === selectedPatient?.id 
            ? { ...p, biometricHistory: [...(p.biometricHistory || []), newRecord] }
            : p
        ));
      }

      // Step 3: triage
      const riskData = await callAgent(AgentID.RISK_TRIAGE, { 
        patient: selectedPatient, 
        previousContext: { ...normData, facial_cues: checkInData.facial_cues },
        currentState
      });
      const riskResponse: AgentResponse = {
        agentId: AgentID.RISK_TRIAGE,
        title: 'Step 3: Risk & Triage Assessment',
        timestamp: new Date().toLocaleTimeString(),
        data: riskData,
        rawJson: JSON.stringify(riskData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ ...prev, currentStep: 4, responses: { ...prev.responses, [AgentID.RISK_TRIAGE]: riskResponse } }));

      // Step 4: orchestrator
      const orchData = await callAgent(AgentID.ORCHESTRATOR, { 
        patient: selectedPatient, 
        previousContext: riskData,
        currentState
      });
      const orchResponse: AgentResponse = {
        agentId: AgentID.ORCHESTRATOR,
        title: 'Step 4: Care Orchestration',
        timestamp: new Date().toLocaleTimeString(),
        data: orchData,
        rawJson: JSON.stringify(orchData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ ...prev, currentStep: 5, responses: { ...prev.responses, [AgentID.ORCHESTRATOR]: orchResponse } }));

      // Step 5: coach
      const coachData = await callAgent(AgentID.COACH, { 
        patient: selectedPatient, 
        previousContext: { checkInData, normData, riskData, orchData },
        currentState
      });
      const coachResponse: AgentResponse = {
        agentId: AgentID.COACH,
        title: 'Step 5: Care Coaching & UI Refresh',
        timestamp: new Date().toLocaleTimeString(),
        data: coachData,
        rawJson: JSON.stringify(coachData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ 
        ...prev, 
        currentStep: 6, 
        isLoading: false, 
        responses: { ...prev.responses, [AgentID.COACH]: coachResponse } 
      }));

      // Step 6: Clinical Analyst (Automatic for demo purposes or can be manual)
      // For this demo, let's run it as part of the pipeline to show the report immediately
      const clinicalData = await callAgent(AgentID.CLINICAL_ANALYST, {
        patient: selectedPatient,
        previousContext: { triageData: riskData, orchData, coachData },
        currentState
      });
      const clinicalResponse: AgentResponse = {
        agentId: AgentID.CLINICAL_ANALYST,
        title: 'Step 6: Clinical Decision Support & Health Report',
        timestamp: new Date().toLocaleTimeString(),
        data: clinicalData,
        rawJson: JSON.stringify(clinicalData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ 
        ...prev, 
        currentStep: 7,
        responses: { ...prev.responses, [AgentID.CLINICAL_ANALYST]: clinicalResponse } 
      }));

    } catch (err: any) {
      console.error(err);
      setWorkflow(prev => ({ ...prev, isLoading: false, error: 'Pipeline processing failed.' }));
    }
  };

  const handleInstantAnalysis = async () => {
    if (!selectedPatient) return;
    
    setWorkflow(prev => ({ ...prev, isLoading: true, currentStep: 3, responses: {}, error: null }));
    
    try {
      const currentState = {
        patientId: selectedPatient.id,
        timestamp: new Date().toISOString(),
        activeAlerts: []
      };

      // Step 3: triage (Directly based on history)
      const riskData = await callAgent(AgentID.RISK_TRIAGE, { 
        patient: selectedPatient, 
        previousContext: { status: 'instant_analysis' },
        currentState
      });
      const riskResponse: AgentResponse = {
        agentId: AgentID.RISK_TRIAGE,
        title: 'Instant Analysis: Risk Assessment',
        timestamp: new Date().toLocaleTimeString(),
        data: riskData,
        rawJson: JSON.stringify(riskData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ ...prev, currentStep: 6, responses: { ...prev.responses, [AgentID.RISK_TRIAGE]: riskResponse } }));

      // Step 6: Clinical Analyst
      const clinicalData = await callAgent(AgentID.CLINICAL_ANALYST, {
        patient: selectedPatient,
        previousContext: { triageData: riskData, isInstant: true },
        currentState
      });
      const clinicalResponse: AgentResponse = {
        agentId: AgentID.CLINICAL_ANALYST,
        title: 'Instant Analysis: Clinical Health Report',
        timestamp: new Date().toLocaleTimeString(),
        data: clinicalData,
        rawJson: JSON.stringify(clinicalData, null, 2),
        status: 'completed'
      };
      setWorkflow(prev => ({ 
        ...prev, 
        currentStep: 7,
        isLoading: false,
        responses: { ...prev.responses, [AgentID.CLINICAL_ANALYST]: clinicalResponse } 
      }));

    } catch (err: any) {
      console.error(err);
      setWorkflow(prev => ({ ...prev, isLoading: false, error: 'Instant analysis failed.' }));
    }
  };

  const handleConfirmClinical = (confirmation: ClinicalConfirmation) => {
    setWorkflow(prev => {
      const clinicalResp = prev.responses[AgentID.CLINICAL_ANALYST];
      if (!clinicalResp) return prev;

      const updatedData = {
        ...clinicalResp.data,
        confirmation
      };

      return {
        ...prev,
        responses: {
          ...prev.responses,
          [AgentID.CLINICAL_ANALYST]: {
            ...clinicalResp,
            data: updatedData
          }
        }
      };
    });

    // Simulate "learning" and system updates
    if (confirmation.action === ConfirmationAction.CONFIRMED || confirmation.action === ConfirmationAction.ADJUST_PLAN) {
      setPatients(prev => prev.map(p => {
        if (p.id !== selectedPatientId) return p;
        
        const updatedPatient = { ...p };
        
        // Add to audit trail
        const newAudit: ClinicalAuditTrail = {
          id: `AUDIT-${Date.now()}`,
          patient_id: p.id,
          timestamp: confirmation.timestamp,
          agent_assessment: {
            risk_level: prev.responses[AgentID.RISK_TRIAGE]?.data?.severity || RiskLevel.LOW,
            triage_level: prev.responses[AgentID.RISK_TRIAGE]?.data?.triage_decision || 'Unknown'
          },
          confirmation
        };
        
        updatedPatient.auditTrail = [newAudit, ...(updatedPatient.auditTrail || [])];

        if (confirmation.adjustments?.care_plan) {
          updatedPatient.baselineNotes = (updatedPatient.baselineNotes || '') + 
            `\n[Update ${new Date().toLocaleDateString()}]: ${confirmation.adjustments.care_plan}`;
        }
        
        if (confirmation.adjustments?.thresholds) {
          updatedPatient.baselineNotes = (updatedPatient.baselineNotes || '') + 
            `\n[Threshold Update]: ${confirmation.adjustments.thresholds}`;
        }

        return updatedPatient;
      }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {view === 'ADMIN' && (
        <Sidebar 
          patients={patients} 
          selectedId={selectedPatientId} 
          onSelect={(p) => {
            setSelectedPatientId(p.id);
            resetWorkflow();
          }} 
        />
      )}
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header view={view} setView={setView} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {view === 'ADMIN' ? (
            <>
              <Dashboard 
                patient={selectedPatient} 
                onTriggerScenario={handleRunWorkflow} 
                onInstantAnalysis={handleInstantAnalysis}
                isProcessing={workflow.isLoading}
                onReset={resetWorkflow}
              />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <WorkflowVisualizer 
                    currentStep={workflow.currentStep} 
                    responses={workflow.responses}
                    isLoading={workflow.isLoading}
                    onConfirmClinical={handleConfirmClinical}
                  />
                </div>
                <div className="xl:col-span-1">
                  <AgentTerminal 
                    responses={workflow.responses} 
                    activeStep={workflow.currentStep} 
                  />
                </div>
              </div>
            </>
          ) : (
            <FamilyApp 
              patient={selectedPatient} 
              workflow={workflow}
              onTriggerAction={handleRunWorkflow}
              isLoading={workflow.isLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
