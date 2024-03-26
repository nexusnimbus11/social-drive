import express from 'express';

import {
    registerUser,
    loginUser,
    recycleOAuthTokens
} from '../controllers/authController.js';
import { verifyOAuthToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/tokens/recycle').get(verifyOAuthToken(true), recycleOAuthTokens);

export default router;
