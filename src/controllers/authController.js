import url from 'url';

import { getGoogleAuthUrl, getOAuth2Client } from '../configs/googleOAuth2Client.js';
import User from '../models/userModel.js';
import ApiErrors from '../utils/api-errors/index.js';
import { generateOAuthTokenPair } from '../utils/encryption.js';
import { catchExceptions } from '../utils/errorHandlers.js';
import { getUserInfoFromIdToken } from '../services/google.js';

export const registerUserWithPassword = catchExceptions(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(ApiErrors.MISSING_PARAMETERS);
    }

    const user = await User.findOne({ email });

    // send error if user already exists in the DB with password login method
    if (user && user.loginMethods.includes('password')) {
        return next(ApiErrors.USER_ALREADY_EXISTS);
    }

    // If user has previously signed-in with google, then update the user's details
    if (user.loginMethods.includes('google')) {
        // update username if present in request body
        user.username = username || user.username;
        // add password to user in case user wants to login using password
        user.password = password;
        // add 'password' to available login methods
        user.loginMethods = [...user.loginMethods, 'password'];
        await user.save();

        return res.status(200).json({
            error: false,
            code: 'password_login_added',
            description: 'You can now login with password too.'
        });
    }

    // create a new user if email is encountered for first time
    const newUser = await User.create({
        username,
        email: email.toLowerCase().trim(),
        password,
        loginMethods: ['password']
    });

    // issue the OAuth tokens for instant login
    const { accessToken, refreshToken } = generateOAuthTokenPair({
        username: newUser.username,
        email: newUser.email
    });

    res.status(201).json({
        error: false,
        code: 'registration_success',
        description: 'User registered sucessfully.',
        access_token: accessToken,
        refresh_token: refreshToken
    });
});

export const loginUserWithPassword = catchExceptions(async (req, res, next) => {
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

    // issue the OAuth tokens for login
    const { accessToken, refreshToken } = generateOAuthTokenPair({
        username: user.username,
        email: user.email
    });

    res.status(200).json({
        error: false,
        code: 'login_success',
        description: 'User authenticated successfully.',
        access_token: accessToken,
        refresh_token: refreshToken
    });
});

/**
 * Uses provided refresh token to return a new set of access and refresh tokens.
 * Refresh token **needs** to be verified before this controller is executed.
 */
export const recycleOAuthTokens = catchExceptions(async (req, res, next) => {
    // Generate new token set and send them
    const { accessToken, refreshToken } = generateOAuthTokenPair({
        username: req.currentUser.username,
        email: req.currentUser.email
    });

    return res.json({
        error: false,
        code: 'tokens_recycled',
        description: 'Fresh tokens issued.',
        access_token: accessToken,
        refresh_token: refreshToken
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
    // get code present in redirect URI
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const code = qs.get('code');

    // get google tokens using the oauth2 client
    const oAuth2Client = getOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const { email, fullName } = await getUserInfoFromIdToken(
        tokens.id_token,
        oAuth2Client
    );

    const user = await User.findOne({ email });

    // If user is not present, create a new user otherwise update the existing info
    if (!user) {
        await User.create({
            username: fullName,
            email,
            googleToken: tokens.access_token,
            loginMethods: ['google']
        });

        return res.status(201).json({
            error: false,
            code: 'registration_success',
            description: 'User registered sucessfully.'
        });
    }

    // if user is already present in the DB, then just update the access token
    user.googleToken = tokens.access_token;

    // if an already existing user has now used google for sign-in, then update his login methods
    if (!user.loginMethods.includes('google')) {
        user.loginMethods = [...user.loginMethods, 'google'];
    }

    await user.save();

    res.status(200).json({
        error: false,
        code: 'login_success',
        description: 'User authenticated successfully.'
    });
});
