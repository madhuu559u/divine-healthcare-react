import { create } from 'zustand';

const useApplicationStore = create((set, get) => ({
  currentStep: 1,
  totalSteps: 9,
  selectedJob: null,

  personalInfo: {
    firstName: '', middleName: '', lastName: '', preferredName: '',
    dob: '', street: '', city: '', state: '', zip: '',
    gender: '', homePhone: '', cellPhone: '', email: '',
    isOver18: '', isCitizen: '', isEligible: '', hearAboutUs: '',
    ssnLast4: '', formerNames: '', driversLicenseNumber: '', driversLicenseState: ''
  },

  employmentDesired: {
    position: '', startDate: '', desiredPay: '',
    employmentType: [], preferredShift: [],
    previouslyEmployed: '', previousDates: ''
  },

  employmentHistory: {
    employers: [
      { name: '', mayContact: '', city: '', state: '', zip: '', title: '', supervisor: '', supervisorTitle: '', dateFrom: '', dateTo: '', phone: '', workPerformed: '', reasonLeaving: '' }
    ],
    convicted: '', convictedExplanation: '',
    excludedMedicaid: '', excludedExplanation: '',
    disciplined: '', disciplinedExplanation: ''
  },

  education: [
    { level: '', schoolName: '', yearsAttended: '', state: '', degreeNumber: '' }
  ],

  licenses: [
    { type: '', state: '', expirationYear: '', number: '' }
  ],

  skillsAssessment: {},

  references: [
    { name: '', phone: '', bestTime: '' },
    { name: '', phone: '', bestTime: '' }
  ],

  documents: {},
  documentFiles: {},

  agreements: {
    backgroundCheck: false, backgroundSignature: '',
    confidentiality: false, confidentialitySignature: '',
    substanceAbuse: false, substanceAbuseSignature: '',
    certification: false, certificationSignature: '',
    atWill: false
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  goToStep: (step) => set({ currentStep: step }),
  setSelectedJob: (job) => set({ selectedJob: job }),

  updatePersonalInfo: (data) => set((s) => ({ personalInfo: { ...s.personalInfo, ...data } })),
  updateEmploymentDesired: (data) => set((s) => ({ employmentDesired: { ...s.employmentDesired, ...data } })),
  updateEmploymentHistory: (data) => set((s) => ({ employmentHistory: { ...s.employmentHistory, ...data } })),
  updateEducation: (data) => set({ education: data }),
  updateLicenses: (data) => set({ licenses: data }),
  updateSkillsAssessment: (data) => set((s) => ({ skillsAssessment: { ...s.skillsAssessment, ...data } })),
  updateReferences: (data) => set({ references: data }),
  updateDocuments: (data) => set((s) => ({ documents: { ...s.documents, ...data } })),
  updateDocumentFiles: (data) => set((s) => ({ documentFiles: { ...s.documentFiles, ...data } })),
  updateAgreements: (data) => set((s) => ({ agreements: { ...s.agreements, ...data } })),

  resetApplication: () => set({
    currentStep: 1, selectedJob: null,
    personalInfo: { firstName: '', middleName: '', lastName: '', preferredName: '', dob: '', street: '', city: '', state: '', zip: '', gender: '', homePhone: '', cellPhone: '', email: '', isOver18: '', isCitizen: '', isEligible: '', hearAboutUs: '', ssnLast4: '', formerNames: '', driversLicenseNumber: '', driversLicenseState: '' },
    employmentDesired: { position: '', startDate: '', desiredPay: '', employmentType: [], preferredShift: [], previouslyEmployed: '', previousDates: '' },
    employmentHistory: { employers: [{ name: '', mayContact: '', city: '', state: '', zip: '', title: '', supervisor: '', supervisorTitle: '', dateFrom: '', dateTo: '', phone: '', workPerformed: '', reasonLeaving: '' }], convicted: '', convictedExplanation: '', excludedMedicaid: '', excludedExplanation: '', disciplined: '', disciplinedExplanation: '' },
    education: [{ level: '', schoolName: '', yearsAttended: '', state: '', degreeNumber: '' }],
    licenses: [{ type: '', state: '', expirationYear: '', number: '' }],
    skillsAssessment: {},
    references: [{ name: '', phone: '', bestTime: '' }, { name: '', phone: '', bestTime: '' }],
    documents: {},
    documentFiles: {},
    agreements: { backgroundCheck: false, backgroundSignature: '', confidentiality: false, confidentialitySignature: '', substanceAbuse: false, substanceAbuseSignature: '', certification: false, certificationSignature: '', atWill: false }
  })
}));

export default useApplicationStore;
