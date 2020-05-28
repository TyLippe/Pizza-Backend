const db = require('../../db/dbConfig')

module.exports = {
    addUser,
    getUsers,
    findUserBy,
    findUserById,
    getOrdersByEmail
}

async function addUser(user) {
    const [id] = await db('users')
        .insert(user)

    return findUserById(id)
}

function getUsers() {
    return db('users')
}

function findUserBy(filter) {
    return db('users')
        .where(filter)
}

function findUserById(id) {
    return db('users')
        .select('id', 'name')
        .where({id})
        .first()
}

function getOrdersByEmail(email) {
    return db('pizza as p')
        .innerJoin('users as u', 'u.id', 'p.user_id')
        .where({email})
        .select('u.email', 'p.crust', 'p.sauce', 'p.cheese', 'p.toppings')
}
