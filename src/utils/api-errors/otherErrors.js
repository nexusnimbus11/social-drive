const OtherErrors = Object.freeze({
    MISSING_PARAMETERS: {
        status_code: 400,
        code: 'missing_parameters',
        description: 'Some of the required parameters are missing.'
    },
    UNKNOWN_ERROR: {
        status_code: 500,
        code: 'unknown_error',
        description: 'Some unexpected error occured on the server.'
    }
});

export default OtherErrors;
