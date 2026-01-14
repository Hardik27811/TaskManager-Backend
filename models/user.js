const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email :{
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    name  : {
        type : String,
        required : true,
        default : "User"
    }
},{timestamps : true}) // mongosoe auto manages created and upadted 

const UserModel = mongoose.model("User",UserSchema);

module.exports = UserModel;