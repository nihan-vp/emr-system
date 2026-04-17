import { createResourceController } from './resourceControllerFactory.js';
import { getPatientById, updatePatient } from '../repositories/clinicStateRepository.js';

export const patientsController = {
  ...createResourceController('patients'),

  listPrescriptions: async (request, response) => {
    const patient = await getPatientById(request.params.id);

    if (!patient) {
      return response.status(404).json({
        ok: false,
        message: 'Patient not found.',
      });
    }

    return response.json({
      ok: true,
      data: patient.rxHistory || [],
    });
  },

  savePrescription: async (request, response) => {
    const patient = await getPatientById(request.params.id);

    if (!patient) {
      return response.status(404).json({
        ok: false,
        message: 'Patient not found.',
      });
    }

    const prescription = request.body?.item && typeof request.body.item === 'object'
      ? request.body.item
      : request.body;

    if (!prescription || typeof prescription !== 'object' || prescription.id === undefined || prescription.id === null || prescription.id === '') {
      return response.status(400).json({
        ok: false,
        message: 'Prescription payload with an id is required.',
      });
    }

    let found = false;
    const nextRxHistory = (patient.rxHistory || []).map((item) => {
      if (String(item.id) === String(prescription.id)) {
        found = true;
        return prescription;
      }

      return item;
    });

    const updatedPatient = {
      ...patient,
      rxHistory: found ? nextRxHistory : [prescription, ...(patient.rxHistory || [])],
    };

    await updatePatient(request.params.id, updatedPatient);

    return response.json({
      ok: true,
      data: updatedPatient.rxHistory,
    });
  },

  deletePrescription: async (request, response) => {
    const patient = await getPatientById(request.params.id);

    if (!patient) {
      return response.status(404).json({
        ok: false,
        message: 'Patient not found.',
      });
    }

    const nextRxHistory = (patient.rxHistory || []).filter((item) => String(item.id) !== String(request.params.prescriptionId));

    if (nextRxHistory.length === (patient.rxHistory || []).length) {
      return response.status(404).json({
        ok: false,
        message: 'Prescription not found.',
      });
    }

    await updatePatient(request.params.id, {
      ...patient,
      rxHistory: nextRxHistory,
    });

    return response.json({
      ok: true,
      message: 'Prescription deleted.',
    });
  },
};
