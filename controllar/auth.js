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

app.set("views",path.join(__dirname,"views")) 
app.set("view engine","ejs") 


app.use(express.static(path.join(__dirname,'/image')));
app.use(multer({ dest : 'images' }).single('myfile')); 

// const helpers = require("./image_edit")


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

app.get("/confirming_detail",(req,res)=>{
    res.sendFile(path.join(__dirname+"/view/end.html"))

})

app.get("/instractor_page",(req,res)=>{
    res.sendFile(path.join(__dirname+"/view/instractor_page.html"))
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


    let response=knex1.select(emails,passwords)
    response.then((data)=>{
        // console.log(data)
        if(data.length==0){
            res.send("your email is incorrect...")
        }
        else if(data[0]["password"]===passwords){
            let token = jwt.sign({"user":data[0]},"secret_key")
            jwt.verify(token,"secret_key",(err,rsult)=>{
                if( data[0]["user_id"] === uid && stages==="student"){
                    console.log("succesfully login") 
                    res.redirect("/login_account")             
                    // res.sendFile(path.join(__dirname+"/view/introduction.html"))

                }else if ("instrouctore" == stages){
                    res.redirect("/instractor_page")
                }   else{
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
        cb(null, path.join(__dirname+"/images/"));
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        console.log(req.file)
        cb(null, file.fieldname + '-' + Date.now() + ".jpg");
    }
});

var upload = multer({
    storage: storage
}).single('myfile');


app.post("/upload_multiple_images", function(req, res) {
    var data = req.file
    var studentDetails= {
        task:data.filename
    }
    let response = knex1.student_task(studentDetails)
    response.then((data)=>{
    })
    
    upload(req, res, function(err) {
        if (err) {
            return res.send("Something went wrong!");
        }
             res.redirect("/confirming_detail");
    });
});


app.post("/submit_once_data", function(req, res) {
    var studentDetails= {
        name:req.body.name,
        email:req.body.email,
    }
    let response = knex1.confirm_data(studentDetails)
    response.then((data)=>{
        res.send("confirm data")
    })
});


app.get("/student_details",(req,res)=>{
    let response = knex1.select_submit_data()
    response.then((data)=>{
        res.render('student_details',{title:'User List', userData:data})
    }).catch((err)=>{
        console.log(err)
    })
})


app.get("/user_list",(req,res)=>{
    let response = knex1.select_submit_data()
    response.then((data)=>{
        res.render('user_list',{title:'User List', userData:data})
    }).catch((err)=>{
        console.log(err)
    })
})

app.post("/add_grade",(req,res)=>{
    var grad = req.body.stu_grade
    var ids = req.body.stu_id 
    // console.log(ids)
    const quries = knex1.updatGrade(ids,grad)
    quries.then((data)=>{
        res.send("You give grade to all")
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })


})

app.post("/submission_data",(req,res)=>{
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          res.write('File uploaded');
          res.send();
        });
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.send();
      }
})



app.listen(3500, () => {
    console.log("server started on port 3500")
})

app.post("/student_grade",function(req,res){
    var student = {
        name:req.body.name,
        email:req.body.email,
        student_grade:req.body.student_grade
    } 
    if(student.student_grade<=5 && student.student_grade>=1){
        let response=knex1.grade(student)
        response.then((data)=>{
        res.send(data)
        res.redirect("/my_grade")
        console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })

    }   
})
app.get("/my_grade",function(req,res){
    res.sendFile(path.join(__dirname+"/view/student_grade.html"))
    

})