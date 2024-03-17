import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import validator from 'validator';

/**
 * A validator function that checks whether password shhould be a required field or not
 */
function isPasswordRequired() {
    return !this.googleToken;
}

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: [true, 'Custom|Email should be in lowercase.'],
            validate: [validator.isEmail, 'Custom|Please provide a valid email.']
        },
        password: {
            type: String,
            minlength: [8, 'Custom|Password should be atleast 8 characters long.'],
            required: [isPasswordRequired, 'Custom|Password is not provided.']
        },
        googleToken: String
    },
    {
        timestamps: true
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    const response = await bcrypt.compare(enteredPassword, this.password);

    return response;
};

userSchema.pre('save', async function (next) {
    // Encrypt password using bcrypt if user signed using traditional email-password method
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

const User = model('User', userSchema);

export default User;
