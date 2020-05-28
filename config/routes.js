const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('./secrets')
const {admin} = require('../mw/admin')
const {authenticate} = require('../mw/auth')

const User = require('./user/userModel')
const Order = require('./order/orderModel')

module.exports = server => {
    server.get('/', testing)
    server.post('/api/register', userRegister)
    server.post('/api/login', userLogin)
    server.get('/api/users', admin, getUsers)
    server.post('/api/orders', admin, searchOrders)
    server.post('/api/:id/order/pizza', authenticate, addPizza)
}

function testing(req, res) {
    res.send('If you can read this then I am working!')
}

function generateToken(user) {
    const jwtPayload = {
        subject: user.id,
        email: user.email
    };
  
    const jwtOptions = {
        expiresIn: '1d',
    };
    return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions);
};

function userRegister(req, res) {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 8)
    user.password = hash

    User.addUser(user)
        .then(saved => {
            res.status(200).json(saved)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

function userLogin(req, res) {
    let {email, password} = req.body

    User.findUserBy({email})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                const id = user.id
                const type = user.type
                    res.status(200).json({
                        id,
                        email,
                        type,
                        token
                    })
            } else {
                res.status(401).json({
                    message: 'Invalid Credentials'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'Email or Password is Incorrect'
            })
        })
}

function getUsers(req, res) {
    User.getUsers()
        .then(userList => {
            res.status(201).json(userList)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

function addPizza(req, res) {
    let pizza = req.body
    let {id} = req.params

    Order.addPizza(pizza, id)
        .then(order => {
            res.status(200).json(order)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

function searchOrders(req, res) {
    let {email} = req.body
    
    User.getOrdersByEmail(email)
        .then(orderList => {
            res.status(201).json(orderList)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

function deleteOrder(res, req) {

}