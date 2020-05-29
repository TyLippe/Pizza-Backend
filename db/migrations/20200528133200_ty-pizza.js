
exports.up = function(knex) {
    return knex.schema.createTable('users', users => {
        users.increments()

        users
            .string('name', 128)
            .notNullable()
        users
            .string('email', 128)
            .notNullable()
            .unique()
        users
            .string('password', 128)
            .notNullable()
        users
            .string('city', 128)
            .notNullable()
        users
            .string('state', 128)
            .notNullable()
        users 
            .string('zip', 128)
            .notNullable()
        users
            .string('type')
            .defaultTo('basic')
    })
    .createTable('order', order => {
        order.increments()

        order
            .string('item_type')
        order
            .string('crust')
        order
            .string('sauce')
        order
            .string('cheese')
        order
            .json('toppings')
        order
            .string('type')
        order
            .integer('amount')
        order
            .string('size')
        order
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('order')
};
