/**
 * Gets the various user auth endpoints by making a request to Google's discovery document
 * Source: https://developers.google.com/identity/openid-connect/openid-connect#discovery
 */
export async function getUserAuthEndpoints() {
    const DISCOVERY_DOCUMENT_URL =
        'https://accounts.google.com/.well-known/openid-configuration';

    try {
        const res = await fetch(DISCOVERY_DOCUMENT_URL);
        const data = await res.json();

        return data;
    } catch (err) {
        console.log('Error in fetching the discovery document:\n', err);
        return null;
    }
}

/**
 * Fetches user info from Google
 * @param {OAuth2Client} authenticatedClient - OAuth2Client with tokens set
 * @returns {Promise<{ email: string, fullName: string, profileImg: string }> | null}
 */
export async function fetchGoogleUserInfo(authenticatedClient) {
    try {
        const discoveryDoc = await getUserAuthEndpoints();

        if (discoveryDoc) {
            const resData = await authenticatedClient.request({
                url: discoveryDoc.userinfo_endpoint
            });

            const { email, name, picture } = resData.data;

            return {
                email,
                fullName: name,
                profileImg: picture
            };
        }
    } catch (err) {
        console.log('Error in fetching user info:\n', err);
        return null;
    }
}

/**
 * Verifies google's `id_token` and extracts user's name and picture
 * @param {string} idToken - Google OAuth2 `id_token`
 * @param {OAuth2Client} client
 * @returns {Promise<{ email: string, fullName: string, profileImg: string }> | null}
 */
export async function getUserInfoFromIdToken(idToken, client) {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        // payload contains only certain user data that is allowed in the client scope
        const { email, name, picture } = ticket.getPayload();

        return {
            email,
            fullName: name,
            profileImg: picture
        };
    } catch (err) {
        console.log('Error verifying ID token: ', err);
        return null;
    }
}

// const { access_token, token_type } = tokenRes.tokens;

//     // const userData = await getUserInfoFromIdToken(tokenRes.tokens.id_token, oAuth2Client);
//     const userData = await fetchGoogleUserInfo(`${token_type} ${access_token}`);

//     if (userData) {
//         console.log(userData);
//     }
