const knex1 = require("../model/connection")
var formidable = require('formidable');
let fs = require("fs");
const multer = require('multer');

const express = require('express');
const path = require('path');
var bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
var app = express();
let pdf = require("html-pdf");
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/introduction', function (req, res) {
    res.sendFile(path.join(__dirname + '/shivani.txt'));
});


app.get('/create_user_account', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/user_account.html'));
});

app.get("/editing_task",function(req,res){
    res.sendFile(path.join(__dirname+"/view/student_task.html"))
})

app.get("/login_account",function(req,res){
    res.sendFile(path.join(__dirname+"/view/introduction.html"))
})

// app.get("/submission2222",function(req,res){
//     res.sendFile(path.join(__dirname+"/view/upload.html"))

// })
app.get("/submission",function(req,res){
    res.sendFile(path.join(__dirname+"/view/submit_task.html"))

})

app.get("/bigneer_task",function(req,res){
    res.sendFile(path.join(__dirname+"/view/bigner.html"))
})

app.get("/intermediate",(req,res)=>{
    res.sendFile(path.join(__dirname+"/view/mediun_student.html"))

})

app.get("/advanced_student",(req,res)=>{
    res.sendFile(path.join(__dirname+"/view/advanced_student.html"))

})

// app.use(express.static(__dirname+"/view/upload.html"));

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

app.post("/user_account",(req,res)=>{
    let userDetails={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirm_psw:req.body.confirm_psw,
        user_id:req.body.user_id,
        stage:req.body.stage
    }
    let response = knex1.insert_token(userDetails)
    response.then((data)=>{
        res.redirect("/login_account")
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


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
        }
        else if(data[0]["password"]==passwords){
            let token = jwt.sign({"user":data[0]},"secret_key")
            res.cookie(token)
            jwt.verify(token,"secret_key",(err,rsult)=>{
                if(data[0]["stage"] === stages && data[0]["user_id"] === uid){
                    console.log("succesfully login") 
                    res.redirect("/login_account")             
                    // res.sendFile(path.join(__dirname+"/view/introduction.html"))

                }else{
                    res.send("you are not a instructor")
                }   
            })
        }
    }).catch((err)=>{
        res.send(err)
    })
})

app.post("/student_task",(req,res)=>{
  var students_task = req.body.browser
  if(students_task === "Beginner"){
      res.redirect("/bigneer_task")
  }else if(students_task === "Intermediate"){
    res.redirect("/intermediate")
}else if (students_task = "Advanced"){
    res.redirect("/advanced_student")
}else{
    res.send("You didn't choose you level")
}
})


app.post("/generateReport", (req, res) => {
    let html2 = fs.readFileSync("shivi.html", 'utf8');
    let options = { format: 'A4' ,
    "directory" : "/tmp",
    };
    pdf.create(html2, options).toStream(function(err, stream2){
        console.log(err);
        stream2.pipe(res);
        stream2.on('end', function () {
        try{
        fs.unlink(mergeFileRes)
        }
        catch (err){
        console.log(3090, "Did not delete file");
        }
    })
})
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.post('/upload_multiple_images', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple_images', 10);
    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file){
            return res.send("please select an image upload");
        }
        else if(err instanceof multer.MulterError){
            return res.send(err);
        }
        else if(err){
            return res.send(err)
        }
        // res.send("you have upload this image")
 
        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="./">Upload more images</a>';
        res.send(result);
    });
});




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
})



app.listen(3500, () => {
    console.log("server started on port 3500")
})