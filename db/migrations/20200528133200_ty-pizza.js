
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
    // .createTable('order', order => {
    //     order.increments()

    //     order
    //         .integer('user_id')
    //         .unsigned()
    //         .notNullable()
    //         .references('id')
    //         .inTable('users')
    //         .onUpdate('CASCADE')
    //         .onDelete('CASCADE')
    // })
    .createTable('pizza', pizza => {
        pizza.increments()

        pizza
        .string('crust', 128)
        .notNullable()
        pizza
        .string('sauce', 128)
        .notNullable()
        pizza
        .string('cheese', 128)
        .notNullable()
        pizza   
        .json('toppings')
        .notNullable()
        pizza
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
    .createTable('wings', wings => {
        wings.increments()

        wings
            .string('type', 128)
            .notNullable()
        wings
            .integer('amount')
            .notNullable()
        wings
            .string('sauce', 128)
            .notNullable()
        wings
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
    .createTable('sides', sides => {
        sides.increments()

        sides
            .json('type')
            .notNullable()
        sides
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
    .createTable('drinks', drinks => {
        drinks.increments()

        drinks
            .string('size', 128)
            .notNullable()
        drinks
            .string('type', 128)
            .notNullable()
        drinks
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
        // .dropTableIfExists('order')
        .dropTableIfExists('pizza')
        .dropTableIfExists('wings')
        .dropTableIfExists('sides')
        .dropTableIfExists('drinks')
};
