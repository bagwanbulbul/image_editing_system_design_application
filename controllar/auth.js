const knex1 = require("../model/connection")
var formidable = require('formidable');

const express = require('express');
const path = require('path');
var bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))


// var nJwt_data = require('njwt');


app.get('/introduction', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/introduction.html'));
});


app.get('/create_user_account', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/user_account.html'));
});

app.get("/editing_task",function(req,res){
    res.sendFile(path.join(__dirname+"/view/student_task.html"))
})

app.get("/login_account",function(req,res){
    res.sendFile(path.join(__dirname+"/view/student_login.html"))
})

app.get("/submission",function(req,res){
    res.sendFile(path.join(__dirname+"/view/upload.html"))

})



app.post("/user_account",(req,res)=>{
    let userDetails={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirm_psw:req.body.confirm_psw,
        user_id:req.body.user_id,
        stage:req.body.stage
    }
    console.log(userDetails)

    let response = knex1.insert_token(userDetails)
    response.then((data)=>{
        // res.redirect("/loan_intro")
        console.log(data)
        res.redirect("/editing_task")
    }).catch((err)=>{
        console.log(err)
        res.send("erorrrr")
    })
})

// app.get("/login",function(req,res){
//     let email=req.body.email
//     let password=req.body.psw
//     let response=add.select(email,password)
//     response.then((data)=>{
//         if(data.length==0){
//             res.send("your email is incorect please tryy again letter")
//         }
//         else if(data[0]["password"]==password){
//             let token =jwt.sign({"user":data[0]},"secret_key")
//             res.cookie(token)
//             jwt.verify(token,"secret_key",(err,result)=>{
//                 res.sendFile(path.join(__dirname+"/view/student_task.html"))
//             })
//         }
//     }).catch((err)=>{
//         res.send("errrrrrrr")
//     })
// })

app.post("/login",function(req,res){
    let emails=req.body.email;
    let passwords=req.body.password;
    let stages = req.body.browser
    let uid = req.body.user_id
    console.log(emails,passwords,stages,uid)


    let response=knex1.select(emails,passwords)
    response.then((data)=>{
        console.log(data)
        if(data.length==0){
            res.send("your email is incorrect...")
            console.log("hgggggggggggggggggggggggggggggggggggggggggggggg")
        }
        else if(data[0]["password"]==passwords){
            let token = jwt.sign({"user":data[0]},"secret_key")
            res.cookie(token)
            jwt.verify(token,"secret_key",(err,rsult)=>{
                console.log(data[0]["stage"])
                console.log(data[0]["user_id"])
                if(data[0]["stage"] === stages && data[0]["user_id"] === uid){
                    console.log("succesfully login")              
                    res.sendFile(path.join(__dirname+"/view/student_task.html"))

                }else{
                    res.send("you are not a instructor")
                }
                
            })
        }
    }).catch((err)=>{
        res.send(err)
    })
})

app.post("/submission_data",(req,res)=>{
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          res.write('File uploaded');
          res.end();
        });
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
      }
    // let data = req.body.upload
    // console.log(data)
    // res.send("data")
})



app.listen(3500, () => {
    console.log("server started on port 3500")
})