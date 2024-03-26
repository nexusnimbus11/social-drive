import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    });

const generateRefreshToken = (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    });

/**
 * Generates JWT access and refresh token for the given payload
 * @param {any} payload
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export const generateOAuthTokenPair = (payload) => ({
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
});
