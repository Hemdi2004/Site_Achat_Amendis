import { Router } from 'express';
import { TenderController } from '../controllers/tender.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTenderSchema,
  tenderIdSchema,
} from '../validators/tender.validator.js';

const router = Router();

router.get(
  '/',
  TenderController.getPublished
);

router.post(
  '/',
  authenticate,
  validate(createTenderSchema),
  TenderController.create
);

router.patch(
  '/:tenderId/publish',
  authenticate,
  validate(tenderIdSchema),
  TenderController.publish
);// patch is used to update the status of a tender to "PUBLISHED". It requires authentication and validation of the tenderId parameter. The TenderController.publish method handles the logic for publishing the tender.

export default router;