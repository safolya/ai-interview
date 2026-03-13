const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        required:true,
        type:String,
        unique:[true,"Username already exists"]
    },
    email:{
        required:true,
        type:String,
        unique:[true,"Email already exists"]
    },
    password:{
        required:true,
        type:String
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;