import { ClinicState } from '../models/ClinicState.js';
import { defaultClinicState, ensureClinicState } from '../seed/defaultClinicState.js';

export const editableCollections = new Set(Object.keys(defaultClinicState));

export const sanitizeClinicState = (stateDocument) => {
  if (!stateDocument) {
    return null;
  }

  return {
    appointments: stateDocument.appointments || [],
    patients: stateDocument.patients || [],
    medicines: stateDocument.medicines || [],
    templates: stateDocument.templates || [],
    procedures: stateDocument.procedures || [],
  };
};

const normalizeId = (value) => String(value ?? '').trim();

const getCollectionItems = (stateDocument, collection) => {
  if (!editableCollections.has(collection)) {
    throw new Error(`Unknown collection: ${collection}`);
  }

  return Array.isArray(stateDocument?.[collection]) ? stateDocument[collection] : [];
};

export const getClinicStateSnapshot = async () => {
  const state = await ensureClinicState();
  return sanitizeClinicState(state);
};

export const getCollection = async (collection) => {
  const state = await ensureClinicState();
  return getCollectionItems(state, collection);
};

export const replaceCollection = async (collection, items) => {
  await ensureClinicState();

  const updatedState = await ClinicState.findOneAndUpdate(
    { stateKey: 'primary' },
    { $set: { [collection]: items } },
    { new: true, runValidators: true }
  ).lean();

  return getCollectionItems(updatedState, collection);
};

export const findCollectionItem = async (collection, itemId) => {
  const items = await getCollection(collection);
  const targetId = normalizeId(itemId);

  return items.find((item) => normalizeId(item?.id) === targetId) || null;
};

export const createCollectionItem = async (collection, item) => {
  const items = await getCollection(collection);
  return replaceCollection(collection, [item, ...items]);
};

export const updateCollectionItem = async (collection, itemId, nextItem) => {
  const items = await getCollection(collection);
  const targetId = normalizeId(itemId);
  let found = false;

  const updatedItems = items.map((item) => {
    if (normalizeId(item?.id) === targetId) {
      found = true;
      return nextItem;
    }

    return item;
  });

  if (!found) {
    return null;
  }

  await replaceCollection(collection, updatedItems);
  return nextItem;
};

export const deleteCollectionItem = async (collection, itemId) => {
  const items = await getCollection(collection);
  const targetId = normalizeId(itemId);
  const nextItems = items.filter((item) => normalizeId(item?.id) !== targetId);

  if (nextItems.length === items.length) {
    return false;
  }

  await replaceCollection(collection, nextItems);
  return true;
};

export const getPatientById = async (patientId) => {
  return findCollectionItem('patients', patientId);
};

export const updatePatient = async (patientId, nextPatient) => {
  return updateCollectionItem('patients', patientId, nextPatient);
};

export const listLabOrders = async () => {
  const patients = await getCollection('patients');

  return patients.flatMap((patient) => (
    (patient.rxHistory || []).flatMap((prescription) => (
      (prescription.nextVisitInvestigations || []).map((investigation) => ({
        patientId: patient.id,
        patientName: patient.name || 'Unknown Patient',
        patientMobile: patient.mobile || '',
        prescriptionId: prescription.id,
        prescriptionDate: prescription.date || prescription.updatedAt || prescription.createdAt || null,
        diagnosis: prescription.diagnosis || '',
        investigationId: investigation.id,
        investigationName: investigation.name || 'Unnamed Test',
        investigationCategory: investigation.category || 'Lab',
        report: investigation.report || null,
        status: investigation?.report?.uploadedAt ? 'completed' : 'pending'
      }))
    ))
  ));
};

export const attachLabReport = async ({ patientId, prescriptionId, investigationId, report }) => {
  const patient = await getPatientById(patientId);

  if (!patient) {
    return null;
  }

  const nextRxHistory = (patient.rxHistory || []).map((prescription) => {
    if (normalizeId(prescription.id) !== normalizeId(prescriptionId)) {
      return prescription;
    }

    return {
      ...prescription,
      updatedAt: new Date().toISOString(),
      nextVisitInvestigations: (prescription.nextVisitInvestigations || []).map((investigation) => {
        if (normalizeId(investigation.id) !== normalizeId(investigationId)) {
          return investigation;
        }

        return {
          ...investigation,
          report,
        };
      })
    };
  });

  const nextPatient = {
    ...patient,
    rxHistory: nextRxHistory,
  };

  await updatePatient(patientId, nextPatient);

  return nextPatient;
};
