const sendUserToken = (user, statusCode, res) => {
    // Creating JWT Token
    const token = user.getJwtToken();

    // Setting cookies
    const expiresInDays = parseInt(process.env.COOKIE_EXPIRES_TIME, 10);
    if (isNaN(expiresInDays)) {
        throw new Error('Invalid COOKIE_EXPIRES_TIME');
    }
    
    const options = {
        expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    };
    

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        });
        // return token
};

module.exports = sendUserToken;