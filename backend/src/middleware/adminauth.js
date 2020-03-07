const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user || !user.admin) {
            res.status(500).send("Unauthorized");
        } else {
            req.user = user;
            req.token = token;
            next();
        }
    } catch (error) {
        res.status(500).send("Unauthorized");
    }
}

module.exports = auth