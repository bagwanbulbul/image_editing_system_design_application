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

var student_task = (details)=>{
    return knex.select("*").from("student_submited_task").insert(details)
}

var grade = (std_grade)=>{
    return knex.select("*").from("student_grade").insert(std_grade)
}

var confirm_data=(data)=>{
    return knex.select("*").from("confirm_details").insert(data)
    // .into("student_submited_task")
}

var select_submit_data = ()=>{
    return knex.select("*").from("confirm_details")
    .where("grade",0)
}



const updatGrade=((id, collection)=> {
     var data = Array.isArray(id);
     if(data === true){
        const updateAll = []
        for (var i = 0,max = collection.length; i<max; i+=1){
           const query = knex("confirm_details").where('email',id[i]).update({"grade":collection[i]})
           updateAll.push(query)  
        } 
        return Promise.all(updateAll)
     }
     else{
        return knex("confirm_details").where("email",id).update({"grade":collection})
     }
 })



module.exports={insert_token,select,student_task,grade,confirm_data,select_submit_data,updatGrade}