import { Router } from 'express';

import { proceduresController } from '../controllers/proceduresController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(proceduresController.list));
router.get('/:id', asyncHandler(proceduresController.getById));
router.post('/', asyncHandler(proceduresController.create));
router.put('/:id', asyncHandler(proceduresController.update));
router.delete('/:id', asyncHandler(proceduresController.remove));

export default router;
