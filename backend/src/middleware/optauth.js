const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optauth = async(req, res, next) => {
    const auth = req.header('Authorization');
    if (!auth) {
        next();
    } else {
        const token = auth.replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        try {
            const user = await User.findOne({ _id: data._id, 'tokens.token': token });
            if (user) {
                req.user = user;
                req.token = token;
            }
            next();
        } catch (error) {
            res.status(401).send({ error: 'Not authorized to access this resource' });
        }
    }
}

module.exports = optauth