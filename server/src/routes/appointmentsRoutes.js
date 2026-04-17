import { Router } from 'express';

import { appointmentsController } from '../controllers/appointmentsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(appointmentsController.list));
router.get('/:id', asyncHandler(appointmentsController.getById));
router.post('/', asyncHandler(appointmentsController.create));
router.put('/:id', asyncHandler(appointmentsController.update));
router.delete('/:id', asyncHandler(appointmentsController.remove));

export default router;
