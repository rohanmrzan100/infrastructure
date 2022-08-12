require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const upload = require('./utils/multer');
const {cloudinary}= require('./utils/cloudinary');




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
       
        const email = req.body.email;
        const password = req.body.password;
        userModel.findOne({email:email},(err,foundUser)=>{
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
                            loginText:"Incorrect password."
                        })
                    }
                }
                else{
                    res.render('login',{
                        loginText:"Invalid email"
                    })
                }
            }
        })
    })


//////////////////////   route('/register')
app.route('/register')
    .get((req,res)=>{
        res.render('register',{
            registerText:'',
            text:'',
        });
    })
    .post((req,res)=>{
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
       
        userModel.findOne({email:email},(err,result)=>{
           
                if(err){
                    console.log(err);
                }else{
                    if(result){
                        res.render('register',{
                            text:'Email already in use.',
                            registerText:"Email already in use.",
                        })
                       
                    }else{
                        const newUser = new userModel({
                            name:name,
                            email:email,
                            password:password
                        })
                        newUser.save();
                        res.render('register',{
                
                            text:"Registration Sucessful.Go to login page.",
                            registerText:''
                        })
                       

                    }
                }
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


app.route('/myprofile')
    .get((req,res)=>{
        res.render('myprofile');
    })
app.route('/contact')
    .get((req,res)=>{
        res.render('contact');
    })



//////////////////////   route('/create report')//////////////////////////////////
app.get('/createreport', async (req, res)=>{
    res.render('create-report');
});

app.post('/createreport', upload.single('img') , async (req, res)=>{

   console.log(req.body.latlang);
   let string = req.body.latlang.toString();
   let array =  string.split("(");
   let newo = array[1].split(',')
   let new1 = newo[1].split(')');
   let currentLongtitude = new1[0];
   let currentLatitude = newo[0];
    console.log(currentLongtitude,currentLatitude);



    const result = await cloudinary.uploader.upload(req.file.path);
    const newReport = new reportModel({
        title:req.body.title,
        description:req.body.description,
        cloudinary_url:result.secure_url,
        latitude:Number(`${currentLatitude}`),
        longtitude:Number(`${currentLongtitude}`),
        
     })
    newReport.save();
    res.redirect('home');
   
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
                    cloudinary_url:foundReport.cloudinary_url,
                    lat:foundReport.latitude,
                    long:foundReport.longtitude,
                })
                console.log(foundReport.latitude);
                console.log(foundReport.longtitude);
            }
        })
    })
    .post((req,res)=>{
        reportModel.findOneAndRemove({_id:req.params.report_id},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("deleted successfully");
            }
        })
        res.redirect(`/home`)
    })
    

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
 







const PORT = process.env.PORT;

const start =  ()=>{
    try {
        connectUserDB();
        app.listen(PORT,()=>console.log(`The app is running on port ${PORT}`))
        
    } catch (error) {
        console.log(error);
        
    }
}
start();












