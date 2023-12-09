const sendUserToken = (user, statusCode, res) => {
    // Creating JWT Token
    const token = user.getJwtToken();

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
            user: {
                phoneNo:user.phoneNo, // Adjust this based on your admin object structure
       
                _id:user._id,
                name:user.name// Other admin properties if needed
            },
        });
};

module.exports = sendUserToken;