import AuthErrors from './authErrors.js';
import OtherErrors from './otherErrors.js';
import UserErrors from './userErrors.js';

const ApiErrors = Object.freeze({
    ...AuthErrors,
    ...UserErrors,
    ...OtherErrors
});

export default ApiErrors;
