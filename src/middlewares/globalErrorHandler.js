import ApiErrors from '../utils/api-errors/index.js';

/**
 * @typedef {object} ErrorResponseData
 * @property {number} status_code - HTTP status code to send to client
 * @property {string} code - error code to send to client
 * @property {string} description - error message to send to client
 */

/**
 * Express global error handler - all errors passed in next() will be handled here
 * @param {ErrorResponseData} err - error send as next function's arg
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {VoidFunction} next - Express next function
 */
function globalErrorHandler(err, req, res, next) {
    let { status_code, code, description } = ApiErrors.UNKNOWN_ERROR;

    if (typeof err === 'object' && err?.status_code && err?.code && err?.description) {
        status_code = err.status_code;
        code = err.code;
        description = err.description;
    }

    return res.status(status_code).json({ error: true, code, description });
}

export default globalErrorHandler;
