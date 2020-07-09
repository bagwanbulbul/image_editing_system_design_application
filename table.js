var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'bulbul18',
      database: 'system_design'
    }
  })
knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.string('name')
    table.string('email').unique()
    table.string("user_id").unique()
    table.string('password'),
    table.string("confirm_psw")
    table.string("stage")


    
})
.then(() => console.log("table created"))
.catch((err) => { console.log(err); throw err });