const jwt = require('jsonwebtoken')

const jwtKey =
    process.env.JWT_SECRET || 
    'token';

const User = require('../config/user/userModel')

module.exports = {
    admin
}

function admin(req, res, next) {
    const token = req.get('Authorization');

    if (token) {
      jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) return res.status(401).json(err);
        req.decoded = decoded;
        const email = decoded.email

        User.findUserBy({email})
            .first()
            .then(user => {
                console.log(user)
                if(user.type === 'Admin'){
                    next()
                } else {
                    return res.status(401).json({
                        error: 'Admin access only'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
      });
    } else {
        return res.status(401).json({
            error: 'No token provided, must be set on the Authorization Header',
      });
    }
}