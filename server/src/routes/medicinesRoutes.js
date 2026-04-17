import { Router } from 'express';

import { medicinesController } from '../controllers/medicinesController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(medicinesController.list));
router.get('/:id', asyncHandler(medicinesController.getById));
router.post('/', asyncHandler(medicinesController.create));
router.put('/:id', asyncHandler(medicinesController.update));
router.delete('/:id', asyncHandler(medicinesController.remove));

export default router;
