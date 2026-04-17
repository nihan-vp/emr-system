const normalizeText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');

const normalizeId = (value, fallback) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        return value.trim();
    }

    return fallback;
};

const normalizeIsoDate = (value, fallback = new Date().toISOString()) => {
    if (!value) {
        return fallback;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

export const sanitizePrescriptionMedicine = (medicine = {}, index = 0) => {
    const fallbackId = `med-${Date.now()}-${index}`;

    return {
        id: normalizeId(medicine.id, fallbackId),
        inventoryId: medicine.inventoryId ?? null,
        name: normalizeText(medicine.name),
        content: normalizeText(medicine.content),
        type: normalizeText(medicine.type) || 'Tablet',
        doseQty: normalizeText(medicine.doseQty),
        dosage: normalizeText(medicine.dosage),
        freq: normalizeText(medicine.freq),
        duration: normalizeText(medicine.duration),
        instruction: normalizeText(medicine.instruction),
        isTapering: Boolean(medicine.isTapering)
    };
};

export const sanitizePrescriptionProcedure = (item = {}, index = 0) => {
    if (typeof item === 'string') {
        return {
            id: `item-${Date.now()}-${index}`,
            name: normalizeText(item),
            category: '',
            cost: '',
            duration: '',
            notes: ''
        };
    }

    const fallbackId = `item-${Date.now()}-${index}`;

    return {
        id: normalizeId(item.id, fallbackId),
        name: normalizeText(item.name),
        category: normalizeText(item.category),
        cost: normalizeText(item.cost),
        duration: normalizeText(item.duration),
        notes: normalizeText(item.notes)
    };
};

export const sanitizePrescriptionDraft = (draft = {}) => ({
    ...draft,
    name: normalizeText(draft.name),
    templateName: normalizeText(draft.templateName),
    diagnosis: normalizeText(draft.diagnosis),
    advice: normalizeText(draft.advice),
    referral: normalizeText(draft.referral),
    medicines: Array.isArray(draft.medicines)
        ? draft.medicines.map((item, index) => sanitizePrescriptionMedicine(item, index)).filter((item) => item.name)
        : [],
    procedures: Array.isArray(draft.procedures)
        ? draft.procedures.map((item, index) => sanitizePrescriptionProcedure(item, index)).filter((item) => item.name)
        : [],
    nextVisitInvestigations: Array.isArray(draft.nextVisitInvestigations)
        ? draft.nextVisitInvestigations.map((item, index) => sanitizePrescriptionProcedure(item, index)).filter((item) => item.name)
        : []
});

export const buildPrescriptionRecord = ({
    draft = {},
    patient = null,
    existingRecord = null,
    rxId = null
} = {}) => {
    const nowIso = new Date().toISOString();
    const sanitizedDraft = sanitizePrescriptionDraft(draft);
    const recordId = normalizeId(rxId ?? sanitizedDraft.id, `rx-${Date.now()}`);
    const createdAt = normalizeIsoDate(existingRecord?.createdAt || existingRecord?.date, nowIso);
    const issuedAt = normalizeIsoDate(existingRecord?.date || sanitizedDraft.date, nowIso);

    return {
        id: recordId,
        date: issuedAt,
        createdAt,
        updatedAt: nowIso,
        templateName: sanitizedDraft.templateName || sanitizedDraft.name,
        diagnosis: sanitizedDraft.diagnosis,
        advice: sanitizedDraft.advice,
        referral: sanitizedDraft.referral,
        medicines: sanitizedDraft.medicines,
        procedures: sanitizedDraft.procedures,
        nextVisitInvestigations: sanitizedDraft.nextVisitInvestigations,
        patientSnapshot: patient ? {
            id: patient.id ?? null,
            name: normalizeText(patient.name),
            mobile: normalizeText(patient.mobile),
            age: normalizeText(patient.age),
            gender: normalizeText(patient.gender),
            blood: normalizeText(patient.blood)
        } : null,
        meta: {
            sourceTemplateId: draft.templateId ?? null,
            medicineCount: sanitizedDraft.medicines.length,
            procedureCount: sanitizedDraft.procedures.length,
            investigationCount: sanitizedDraft.nextVisitInvestigations.length
        }
    };
};

export const normalizePrescriptionRecord = (record = {}, patient = null) => {
    return buildPrescriptionRecord({
        draft: record,
        patient,
        existingRecord: record,
        rxId: record.id
    });
};

export const normalizePatientRecord = (patient = {}) => ({
    ...patient,
    vitalsHistory: Array.isArray(patient.vitalsHistory) ? patient.vitalsHistory : [],
    rxHistory: Array.isArray(patient.rxHistory)
        ? patient.rxHistory.map((record) => normalizePrescriptionRecord(record, patient))
        : []
});
