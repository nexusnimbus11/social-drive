import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import ApiErrors from '../utils/api-errors/index.js';
import { generateOAuthTokenPair } from '../utils/encryption.js';
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
    const newUser = await User.create({
        username,
        email: email.toLowerCase().trim(),
        password
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
