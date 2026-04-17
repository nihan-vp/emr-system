import { attachLabReport, listLabOrders } from '../repositories/clinicStateRepository.js';

export const labController = {
  listOrders: async (_request, response) => {
    const orders = await listLabOrders();

    return response.json({
      ok: true,
      data: orders,
    });
  },

  uploadReport: async (request, response) => {
    const { patientId, prescriptionId, investigationId } = request.params;
    const report = request.body?.report && typeof request.body.report === 'object'
      ? request.body.report
      : request.body;

    if (!report || typeof report !== 'object' || !report.fileName || !report.uploadedAt) {
      return response.status(400).json({
        ok: false,
        message: 'Report payload with at least fileName and uploadedAt is required.',
      });
    }

    const updatedPatient = await attachLabReport({
      patientId,
      prescriptionId,
      investigationId,
      report,
    });

    if (!updatedPatient) {
      return response.status(404).json({
        ok: false,
        message: 'Patient or prescription not found.',
      });
    }

    return response.json({
      ok: true,
      data: updatedPatient,
    });
  },
};
