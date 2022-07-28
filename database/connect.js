const mongoose = require('mongoose');
require('dotenv').config();
const encrypt = require('mongoose-encryption')


const secret = process.env.SOME_LONG_UNGUESSABLE_STRING;

const connectUserDB = ()=>{
     mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Connected to user DB"))
}

//user information 
const userSchema = new mongoose.Schema({
    email : String,
    username:String,
    password:String
})
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ["password"] });

const userModel = new mongoose.model('user',userSchema);


//Reports information
const reportSchema = new mongoose.Schema({
    title : String,
    description:String,
    cloudinary_url:String 
})
const reportModel = new mongoose.model('report',reportSchema);




module.exports = {
    connectUserDB,
    userModel,
    reportModel       
}