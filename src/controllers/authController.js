import User from '../models/userModel.js';
import asyncHandler from '../utils/aync-handler.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ error: true, description: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password
    });

    if (user) {
        res.status(200).json({
            error: false,
            description: 'User registered sucessfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(400).json({ error: true, description: 'Some Error occurred' });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            error: false,
            description: 'User authenticated successfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(400).json({
            error: true,
            description: 'Invalid username or password'
        });
    }
});
export { registerUser, loginUser };
