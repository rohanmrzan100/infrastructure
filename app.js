require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const upload = require('./utils/multer');
const {cloudinary}= require('./utils/cloudinary')
const encrypt = require('mongoose-encryption')
const {
    connectUserDB,
    userModel,
    reportModel
 } = require('./database/connect');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json({limit: "50m"}));
app.use(express.urlencoded({limit: "50mb", extended: false}));

//routing



//   route('/')
app.route('/')
    .get((req,res)=>{
        res.render('login',{
            loginText:''
        });
    })
//////////////////////   route('/login')
app.route('/login')
    .get((req,res)=>{
        res.render('login',{
            loginText:"",
        });
    })
    .post((req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        userModel.findOne({username:username},(err,foundUser)=>{
            if(err){
                console.log(err);
            }
            else{
                if(foundUser){
                    if(password == foundUser.password){
                        res.redirect('home');
                    }
                    else{
                        res.render('login',{
                            loginText:"Incorrect Password"
                        })
                    }
                }
                else{
                    res.render('login',{
                        loginText:"Invalid username"
                    })
                }
            }
        })
    })


//////////////////////   route('/register')
app.route('/register')
    .get((req,res)=>{
        res.render('register',{
            registerText:"",
        });
    })
    .post((req,res)=>{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        const newUser = new userModel({
        email:email,
        username:username,
        password:password
       });
       newUser.save((err)=>{
        if(err){console.log(err);}
       });
       res.render('register',{
        registerText:"Registration Sucessful !",
       })
    
    });




//////////////////////   route('/home')
app.route('/home')
    .get((req,res)=>{
        reportModel.find((err,results)=>{
            res.render('home',{
                reports:results,
            });
        })
        
      
    })


app.route('/about')
    .get((req,res)=>{
        res.render('about');
    })
app.route('/contact')
    .get((req,res)=>{
        res.render('contact');
    })



//////////////////////   route('/create report')//////////////////////////////////
app.get(('/createreport'),(req,res)=>{
        res.render('create-report')
    })

app.post('/createreport', upload.single('img'),async (req,res)=>{
    console.log("file details: ", req.file);
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("result: ", result);

    const post_details = {
        title: req.body.title,
        image: result.public_id
    }

   
    const newReport = new reportModel({
            title:req.body.title,
            description:req.body.description,
            cloudinary_url:result.secure_url
    })
       
    newReport.save();
    res.redirect('/home');
});
//////////////////////   route('/report/:report_id'')/////////////////////////////
app.route('/report/:report_id')
    .get((req,res)=>{
        let requestedID = req.params.report_id
        
        reportModel.findOne({_id:requestedID},(err,foundReport)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render('report',{
                    report_id:foundReport.id,
                    title:foundReport.title,
                    description:foundReport.description,
                    cloudinary_url:foundReport.cloudinary_url
                })
            }
        })
    })
    .post((req,res)=>{
        reportModel.findOneAndRemove({_id:req.params.report_id},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("deletion successful");
            }
        })
        res.redirect('/home');
    });


app.route('/report/:report_id/edit')
    .get((req,res)=>{
        reportModel.findOne({_id:req.params.report_id},(err,foundReport)=>{
            if(!err){
                res.render('edit',{
                    report_id:foundReport.id,
                    title:foundReport.title,
                    description:foundReport.description
                });
            }
            else{
                console.log(err);
            }
        })
       
    })
    .post((req,res)=>{
        reportModel.findOneAndUpdate({_id:req.params.report_id},{
            title:req.body.title,
            description:req.body.description
        },{new:true},(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Sucessfully Updated");
            }
        })
      res.redirect(`/report/${req.params.report_id}`)
     
    })







const PORT = process.env.PORT;

const start = async ()=>{
    try {
        await connectUserDB();
        
        app.listen(PORT,()=>console.log(`The app is running on port ${PORT}`))
        
    } catch (error) {
        console.log(error);
        
    }
}
start();












