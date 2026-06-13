const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name:{type: String, required:true, trim:true},
    email:{type:String, required:true, lowercase: true, trim: true},
    rating:{type:Number, min:1, max:5,required: true},
    message: {type: String, required: true, trim: true, lowrcase:true,},
    approved: {type: Boolean, default: false},
    createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model ("Review", reviewSchema);