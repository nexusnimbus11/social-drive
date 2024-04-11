import ApiErrors from './api-errors/index.js';

const handleMongooseValidationError = (err) => {
    const { path, message } = Object.values(err.errors)[0];

    // Helper that decided whether to send mongoose error message or the default code message
    const getErrData = (errResData) =>
        // Custom error message is in format `Custom|<msg>`
        message.includes('|')
            ? { ...errResData, description: message.split('|')[1] }
            : errResData;

    switch (path) {
        case 'email':
            return getErrData(ApiErrors.INVALID_EMAIL);
        case 'password':
            return getErrData(ApiErrors.PASSWORD_VALIDATION_FAILED);
        default:
            return ApiErrors.UNKNOWN_ERROR;
    }
};

const getErrorResponseData = (err) => {
    if (err.name === 'ValidationError') {
        return handleMongooseValidationError(err);
    }

    if (err.name === 'JsonWebTokenError') {
        // this means provided JWT is invalid or expired or signature doesn't match (data has been tampered)
        return ApiErrors.INVALID_TOKEN;
    }

    console.log(err);

    // default error
    return ApiErrors.UNKNOWN_ERROR;
};

/**
 * A wrapper for async controller functions that helps avoid repetition of catch block.
 * Invokes user defined express error middleware function on error.
 * @param fn - an async function
 */
export const catchExceptions = (fn) => (req, res, next) =>
    fn(req, res, next).catch((err) => {
        const errorResData = getErrorResponseData(err);
        next(errorResData);
    });
