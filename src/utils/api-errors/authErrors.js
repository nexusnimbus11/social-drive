const AuthErrors = Object.freeze({
    INVALID_AUTH: {
        status_code: 400,
        code: 'invalid_auth',
        description: 'Invalid email or password.'
    },
    INVALID_EMAIL: {
        status_code: 400,
        code: 'invalid_email',
        description: 'Please provide a valid email.'
    },
    PASSWORD_VALIDATION_FAILED: {
        status_code: 400,
        code: 'password_validation_failed',
        description: "Provided password doesn't meet our security requirements."
    },
    PASSWORD_LOGIN_UNAVAILABLE: {
        status_code: 400,
        code: 'password_login_unavailable',
        description: 'User is not registered with password login method.'
    }
});

export default AuthErrors;
