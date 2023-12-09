const sendToken = (admin, statusCode, res) => {
    // Creating JWT Token
    const token = admin.getJwtToken();

    // Setting cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            admin: {
                email: admin.email, 
                token:token/// Adjust this based on your admin object structure
                // Other admin properties if needed
            },
        });
};

module.exports = sendToken;


