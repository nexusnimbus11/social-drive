import express from 'express';

import {
    registerUser,
    loginUser,
    googleAuthCallbackHandler,
    generateGoogleAuthUrl
} from '../controllers/authController.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/oauth/google/generateUrl').get(generateGoogleAuthUrl);
router.route('/oauth/google').get(googleAuthCallbackHandler);

export default router;
