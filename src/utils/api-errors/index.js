import AuthErrors from './authErrors.js';
import UserErrors from './userErrors.js';
import OtherErrors from './otherErrors.js';

const ApiErrors = Object.freeze({
    ...AuthErrors,
    ...UserErrors,
    ...OtherErrors
});

export default ApiErrors;
