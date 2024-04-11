
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required:true,
  },
  email: {
    required: true,
    unique: true,
    type:String,
    },
    
  
});

const User = mongoose.model("User", userSchema);
module.exports = User;
