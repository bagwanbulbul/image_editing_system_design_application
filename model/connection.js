const options = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'bulbul18',
        database: 'system_design'
    }
}

const knex = require('knex')(options);

var insert_token=(data)=>{
    return knex.select("*").from("users").insert(data)
};

var select = (emails,passwords)=>{
    return knex.select("*").from("users").
    where("users.email",emails).andWhere("users.password",passwords)

}
module.exports={insert_token,select}