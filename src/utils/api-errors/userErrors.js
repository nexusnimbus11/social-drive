const UserErrors = Object.freeze({
    USER_NOT_EXIST: {
        status_code: 404,
        code: 'user_not_exist',
        description: 'User not found.'
    },
    USER_ALREADY_EXISTS: {
        status_code: 409,
        code: 'user_already_exists',
        description: 'User is already registered with us.'
    }
});

export default UserErrors;
