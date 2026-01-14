const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //Use with .populate
        ref : "User", 
        required : true,
    },
    title :{
        type : String,
        required : true,
    },
    description : {
        type : String 

    },
    status  : {
        type : String ,
        enum : ["Pending","Completed"],
        default : "Pending"
    }
},{timestamps : true});

const TaskModels = mongoose.model("Tasks",TaskSchema)

module.exports = TaskModels;