const db = require('../../db/dbConfig')

module.exports = {
    addFood,
    getOrderById,
    getOrderByUserId,
    deleteFood
}

async function addFood(food, user_id) {
    const [id] = await db('order')
        .insert({...food, toppings: JSON.stringify(food.toppings), user_id})

    return getOrderById(id)
}

function getOrderById(id) {
    return db('order')
        .where({id})
        .first()
}

function getOrderByUserId(id) {
    return db('order as o')
        .join('users as u', 'u.id', 'o.user_id')
        .where({user_id: id})
        .select('o.id', 'u.email', 'o.item_type', 'o.crust', 'o.sauce', 'o.cheese', 'o.toppings', 'o.amount', 'o.size')
}

function deleteFood(id) {
    return db('order')
        .where({id})
        .del()
}
