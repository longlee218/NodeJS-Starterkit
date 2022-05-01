import express from 'express';
import { getInfo } from '../services/user.service';

const router = express.Router();

router.get('/user', getInfo);

export default router;
