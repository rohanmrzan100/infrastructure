const mongoose = require('mongoose');
require('dotenv').config();





const connectUserDB = ()=>{
     mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Connected to user DB"))
}

//user information 
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const userModel = new mongoose.model('myUser',userSchema);


//Reports information
const reportSchema = new mongoose.Schema({
    title : String,
    description:String,
    cloudinary_url:String,
    latitude:Number,
    longtitude:Number,
   
})

const reportModel = new mongoose.model('myReport',reportSchema);




module.exports = {
    connectUserDB,
    userModel,
    reportModel       
}