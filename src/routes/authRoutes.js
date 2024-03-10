import express from 'express';

import {
    registerUser,
    loginUser,
    recycleOAuthTokens,
    googleAuthCallbackHandler,
    generateGoogleAuthUrl
} from '../controllers/authController.js';
import { verifyOAuthToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/tokens/recycle').get(verifyOAuthToken(true), recycleOAuthTokens);

router.route('/oauth/google/generateUrl').get(generateGoogleAuthUrl);
router.route('/oauth/google').get(googleAuthCallbackHandler);

export default router;
