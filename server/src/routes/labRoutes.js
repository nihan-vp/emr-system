import { Router } from 'express';

import { labController } from '../controllers/labController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/orders', asyncHandler(labController.listOrders));
router.post('/orders/:patientId/:prescriptionId/:investigationId/report', asyncHandler(labController.uploadReport));

export default router;
