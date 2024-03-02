// Route for token refresh
const jwt = require('jsonwebtoken')
const Client = require('../models/clientModel.js')
exports.tokenRefresh = async (req, res, next) => {
    const { refreshToken } = req.body;

    // Validate the refresh token
    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the token is still valid and retrieve user information
        const user = await Client.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Issue a new access token
        const accessToken = generateAccessToken(user);

        // Send the new access token to the client
        res.json({ accessToken });
    } catch (err) {
        console.error('Error refreshing token:', err);
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
};


