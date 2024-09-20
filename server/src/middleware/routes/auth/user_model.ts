import express from 'express';
import { sign_in, register } from './user_controller';

export const router = express.Router();

router.post('/login', sign_in);
//router.post('user/logout');
router.post('/register', register);


