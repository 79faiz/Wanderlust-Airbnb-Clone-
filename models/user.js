const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// passport-local-mongoose hamare liye kuch method  add krdega

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);
// ye plugin hamare liye automatic username fill kardega

module.exports = mongoose.model('User', userSchema);