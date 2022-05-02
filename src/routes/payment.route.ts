import express from 'express';
import { paymentService } from '../services/payment.service';

const router = express.Router();

router.get('/payment/momo', paymentService);

export default router;
