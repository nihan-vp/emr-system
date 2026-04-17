import { Router } from 'express';

import { patientsController } from '../controllers/patientsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(patientsController.list));
router.get('/:id', asyncHandler(patientsController.getById));
router.post('/', asyncHandler(patientsController.create));
router.put('/:id', asyncHandler(patientsController.update));
router.delete('/:id', asyncHandler(patientsController.remove));

router.get('/:id/prescriptions', asyncHandler(patientsController.listPrescriptions));
router.post('/:id/prescriptions', asyncHandler(patientsController.savePrescription));
router.put('/:id/prescriptions/:prescriptionId', asyncHandler(patientsController.savePrescription));
router.delete('/:id/prescriptions/:prescriptionId', asyncHandler(patientsController.deletePrescription));

export default router;
