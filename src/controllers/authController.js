import User from '../models/userModel.js';
import asyncHandler from '../utils/aync-handler.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    // if email already exists in the db
    if (userExists) {
        res.status(400).json({
            error: true,
            code: 'user_already_exists',
            description: 'User already exists'
        });
    }

    await User.create({
        username,
        email: email.toLowerCase().trim(),
        password
    });

    res.status(201).json({
        error: false,
        code: 'registration_success',
        description: 'User registered sucessfully'
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //check when email or password not in request body
    if (!email || !password) {
        res.status(200).json({
            error: true,
            code: 'missing_parameters',
            description: 'Either email or password is missing.'
        });
    }

    const user = await User.findOne({ email });

    //if user corresponding to the given mail do not exist
    if (!user) {
        res.status(200).json({
            error: true,
            code: 'user_notexist',
            description: 'User not exists.'
        });
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
        res.status(200).json({
            error: true,
            code: 'invalid_auth',
            description: 'Invalid username or password'
        });
    }

    res.status(200).json({
        error: false,
        code: 'login_success',
        description: 'User authenticated successfully.'
    });
});
export { registerUser, loginUser };
