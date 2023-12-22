
const sendAstroToken = (astrologer, statusCode, res) => {
  // Creating JWT Token
    console.log('detail',astrologer);

    const token = astrologer.getJwtToken();
    console.log('token',token);
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      astrologer
    });
 
  // Setting cookies
  
};

module.exports = sendAstroToken;
