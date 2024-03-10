import url from 'url';

import { getGoogleAuthUrl, getOAuth2Client } from '../configs/googleOAuth2Client.js';
import User from '../models/userModel.js';
import ApiErrors from '../utils/api-errors/index.js';
import { catchExceptions } from '../utils/errorHandlers.js';

export const registerUser = catchExceptions(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(ApiErrors.MISSING_PARAMETERS);
    }

    // send error if email already exists in the DB
    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(ApiErrors.USER_ALREADY_EXISTS);
    }

    // create new user
    await User.create({
        username,
        email: email.toLowerCase().trim(),
        password
    });

    res.status(201).json({
        error: false,
        code: 'registration_success',
        description: 'User registered sucessfully.'
    });
});

export const loginUser = catchExceptions(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email or password not present in request body
    if (!email || !password) {
        return next(ApiErrors.MISSING_PARAMETERS);
    }

    const user = await User.findOne({ email });

    // if user corresponding to the given mail does not exist
    if (!user) {
        return next(ApiErrors.USER_NOT_EXIST);
    }

    const doesPasswordMatch = await user.matchPassword(password);

    if (!doesPasswordMatch) {
        return next(ApiErrors.INVALID_AUTH);
    }

    res.status(200).json({
        error: false,
        code: 'login_success',
        description: 'User authenticated successfully.'
    });
});

/**
 * Creates and sends the google auth URL to client in order for user to start the
 * sign in with google process
 */
export const generateGoogleAuthUrl = catchExceptions(async (req, res, next) => {
    const oAuth2Client = getOAuth2Client();
    const authUrl = getGoogleAuthUrl(oAuth2Client);

    // Prevent CORS (header value: client base URL)
    res.header('Access-Control-Allow-Origin', process.env.APP_CLIENT_HOST);

    // Allow HTTP while in development
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    res.status(200).json({
        error: false,
        code: 'url_generated',
        auth_url: authUrl
    });
});

/**
 * Handles google outh2 token generation after user has given consent to our app
 * through the client side
 */
export const googleAuthCallbackHandler = catchExceptions(async (req, res, next) => {
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const code = qs.get('code');

    const oAuth2Client = getOAuth2Client();
    const tokenRes = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenRes.tokens);

    console.log(tokenRes.tokens);

    res.sendStatus(200);
});
