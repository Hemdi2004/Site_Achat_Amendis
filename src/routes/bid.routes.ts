import { Router } from 'express';
import { BidController } from '../controllers/bid.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { submitBidSchema } from '../validators/bid.validator.js';

const router = Router();

router.post(
  '/tenders/:tenderId/bids',
  authenticate,
  validate(submitBidSchema),
  BidController.create
);

router.get(
  '/bids/mine',
  authenticate,
  BidController.getMine
);

export default router;