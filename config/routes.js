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
    server.get('/api/:id/order', admin, searchOrders) // :id === User Id
    server.post('/api/order/:id/food', authenticate, addFood) // :id === Order Id
    server.delete('/api/order/:id', authenticate, deleteFood) // :id === Order Id
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

function testing(req, res) {
    res.send('If you can read this then I am working!')
}

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

function searchOrders(req, res) {
    let {id} = req.params
    
    Order.getOrderByUserId(id)
        .then(orderList => {
            res.status(201).json(orderList)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

function addFood(req, res) {
    let food = req.body
    let {id} = req.params

    Order.addFood(food, id)
        .then(order => {
            res.status(200).json(order)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

function deleteFood(req, res) {
    let {id} = req.params

    Order.deleteFood(id)
        .then(updatedOrder => {
            res.status(201).json({
                message: 'Food item deleted from order'
            })
        })
        .catch(err => {
            res.status(500).json(err)
        })
}
