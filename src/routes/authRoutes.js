import express from 'express';

import {
    registerUserWithPassword,
    loginUserWithPassword,
    recycleOAuthTokens,
    googleAuthCallbackHandler,
    generateGoogleAuthUrl
} from '../controllers/authController.js';
import { verifyOAuthToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUserWithPassword);
router.route('/login').post(loginUserWithPassword);
router.route('/tokens/recycle').get(verifyOAuthToken(true), recycleOAuthTokens);

router.route('/oauth/google/generateUrl').get(generateGoogleAuthUrl);
router.route('/oauth/google').get(googleAuthCallbackHandler);

export default router;
