import { OAuth2Client } from 'google-auth-library';

/**
 * Creates an oAuth2 client to authorize the API call
 * @returns {OAuth2Client} client
 */
export function getOAuth2Client() {
    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    return oAuth2Client;
}

/**
 * Generate the url that will be used for the consent dialog
 * @param {OAuth2Client} client
 */
export function getGoogleAuthUrl(client) {
    const authorizeUrl = client.generateAuthUrl({
        access_type: 'online',
        scope: ['openid', 'profile', 'email'].join(' '),
        prompt: 'consent'
    });

    return authorizeUrl;
}
