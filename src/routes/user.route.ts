import express from 'express';
import userController from '../app/user/user.controller';
import CatchAsync from '../utils/CatchAsync';

const router = express.Router();

const PREFIX = '/user'
router.get(`${PREFIX}`, CatchAsync(userController.getInfo()));

export default router;
