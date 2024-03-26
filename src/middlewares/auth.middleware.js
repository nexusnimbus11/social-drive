import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import ApiErrors from '../utils/api-errors/index.js';
import { catchExceptions } from '../utils/errorHandlers.js';

/**
 * Middleware to verify access or refresh token provided in HTTP `Authorization` header
 * @param {boolean} checkRefreshToken - if true, tries to verify a refresh token, otherwise treats the auth header as a access token (Default: false)
 */
export const verifyOAuthToken = (checkRefreshToken = false) =>
    catchExceptions(async (req, res, next) => {
        /**
         * `authHeader = checkRefreshToken ? refresh_token : access_token`
         * @type {string}
         */
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(ApiErrors.MISSING_TOKEN);
        }

        // Check if authHeader is in required format ('Bearer <JWT>')
        const [tokenType, authToken] = authHeader.split(' ');

        const isValidTokenFormat = tokenType === 'Bearer' && authToken;

        if (!isValidTokenFormat) {
            return next(ApiErrors.INVALID_TOKEN);
        }

        // Check if token is valid
        const decodingSecret = checkRefreshToken
            ? process.env.REFRESH_TOKEN_SECRET
            : process.env.ACCESS_TOKEN_SECRET;
        const decodedData = jwt.verify(authToken, decodingSecret);

        // Check if token's owner still has an active account
        const currentUser = await User.find({ email: decodedData.email });

        if (!currentUser) {
            next(ApiErrors.INVALID_TOKEN);
        }

        // TODO: Check if user has changed password after the token was issued, if yes, token is invalid

        // attaching currently logged-in user to req for use in the following middlewares/controllers
        req.currentUser = currentUser;

        return next();
    });
