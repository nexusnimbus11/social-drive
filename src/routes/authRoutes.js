import express from 'express';

import {
    googleAuthCallbackHandler,
    generateGoogleAuthUrl,
    registerUserWithPassword,
    loginUserWithPassword
} from '../controllers/authController.js';

const router = express.Router();

router.route('/register').post(registerUserWithPassword);
router.route('/login').post(loginUserWithPassword);

router.route('/oauth/google/generateUrl').get(generateGoogleAuthUrl);
router.route('/oauth/google').get(googleAuthCallbackHandler);

export default router;
