const getSafeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeText = (value) => String(value ?? '').trim();

const resolveOrderStatus = (investigation = {}) => {
    if (investigation?.report?.uploadedAt) {
        return 'completed';
    }

    return 'pending';
};

export const extractLabOrders = (patients = []) => {
    return patients.flatMap((patient) => (
        getSafeArray(patient?.rxHistory).flatMap((rx) => (
            getSafeArray(rx?.nextVisitInvestigations).map((investigation) => ({
                patientId: patient?.id ?? null,
                patientName: normalizeText(patient?.name) || 'Unknown Patient',
                patientMobile: normalizeText(patient?.mobile),
                rxId: rx?.id ?? null,
                rxDate: rx?.date || rx?.updatedAt || rx?.createdAt || null,
                diagnosis: normalizeText(rx?.diagnosis),
                investigationId: investigation?.id ?? null,
                investigationName: normalizeText(investigation?.name) || 'Unnamed Test',
                investigationCategory: normalizeText(investigation?.category) || 'Lab',
                investigationCost: normalizeText(investigation?.cost),
                status: resolveOrderStatus(investigation),
                report: investigation?.report || null,
            }))
        ))
    )).sort((left, right) => {
        if (left.status !== right.status) {
            return left.status === 'pending' ? -1 : 1;
        }

        return new Date(right.rxDate || 0).getTime() - new Date(left.rxDate || 0).getTime();
    });
};

export const attachLabReportToPatients = (patients = [], order = {}, report = null) => {
    return patients.map((patient) => {
        if (patient?.id !== order?.patientId) {
            return patient;
        }

        return {
            ...patient,
            rxHistory: getSafeArray(patient?.rxHistory).map((rx) => {
                if (rx?.id !== order?.rxId) {
                    return rx;
                }

                return {
                    ...rx,
                    updatedAt: new Date().toISOString(),
                    nextVisitInvestigations: getSafeArray(rx?.nextVisitInvestigations).map((investigation) => {
                        if (investigation?.id !== order?.investigationId) {
                            return investigation;
                        }

                        return {
                            ...investigation,
                            report,
                        };
                    }),
                };
            }),
        };
    });
};
