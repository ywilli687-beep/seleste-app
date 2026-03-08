import { create } from 'zustand';

export const useStore = create((set) => ({
    businessId: null,
    auditId: null,
    businessData: {
        businessName: "",
        industry: "",
        services: "",
        location: "",
        stage: "",
        goals: [],
        budget: "",
        channels: [],
        website: "",
        email: "",
        firstName: "",
        primaryGoal: "",
        biggestChallenge: "",
        currentMarketing: "",
        adSpend: "",
        revenue: "",
        uploadedAssets: [],
        password: ""
    },
    auditResults: null,
    updateBusinessData: (key, value) => set((state) => ({
        businessData: { ...state.businessData, [key]: value }
    })),
    setAuditResults: (results, businessId, auditId) => set({
        auditResults: results,
        ...(businessId && { businessId }),
        ...(auditId && { auditId })
    })
}));
