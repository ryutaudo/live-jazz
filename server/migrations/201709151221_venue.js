const setup = knex =>
  knex.schema.createTable('venue', (t) => {
    t.increments().index();
    t.string('name').notNullable();
    t.decimal('latitude', 12, 8).notNullable();
    t.decimal('longitude', 12, 8).notNullable();
    t.string('address');
    t.string('phone');
    t.integer('capacity');
    t.text('description');
    t.text('image');
  });

const rollback = knex =>
knex.schema.dropTable('venue');

exports.up = setup;
exports.down = rollback;