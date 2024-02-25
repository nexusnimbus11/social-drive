import User from '../models/userModel.js';
import ApiErrors from '../utils/api-errors/index.js';
import { catchExceptions } from '../utils/errorHandlers.js';

export const registerUser = catchExceptions(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(ApiErrors.MISSING_PARAMETERS);
    }

    // send error if email already exists in the DB
    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(ApiErrors.USER_ALREADY_EXISTS);
    }

    // create new user
    await User.create({
        username,
        email: email.toLowerCase().trim(),
        password
    });

    res.status(201).json({
        error: false,
        code: 'registration_success',
        description: 'User registered sucessfully.'
    });
});

export const loginUser = catchExceptions(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email or password not present in request body
    if (!email || !password) {
        return next(ApiErrors.MISSING_PARAMETERS);
    }

    const user = await User.findOne({ email });

    // if user corresponding to the given mail does not exist
    if (!user) {
        return next(ApiErrors.USER_NOT_EXIST);
    }

    const doesPasswordMatch = await user.matchPassword(password);

    if (!doesPasswordMatch) {
        return next(ApiErrors.INVALID_AUTH);
    }

    res.status(200).json({
        error: false,
        code: 'login_success',
        description: 'User authenticated successfully.'
    });
});
