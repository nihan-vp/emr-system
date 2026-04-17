import { Router } from 'express';

import { templatesController } from '../controllers/templatesController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(templatesController.list));
router.get('/:id', asyncHandler(templatesController.getById));
router.post('/', asyncHandler(templatesController.create));
router.put('/:id', asyncHandler(templatesController.update));
router.delete('/:id', asyncHandler(templatesController.remove));

export default router;
