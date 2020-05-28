const db = require('../../db/dbConfig')

module.exports = {
    addPizza,
    addWings,
    addSides,
    addDrink,
    getOrderById
}

async function addPizza(pizza, user_id) {
    const [id] = await db('pizza')
        .insert({...pizza, toppings: JSON.stringify(pizza.toppings), user_id})

    return getOrderById(id)
}

function addWings(wings) {
    return db('wings')
        .insert(wings)
}

function addSides(side) {
    return db('sides')
        .insert(side)
}

function addDrink(drink) {
    return db('drinks')
        .insert(drink)
}

function getOrderById(id) {
    return db('pizza')
        .where({id})
        .first()
}
