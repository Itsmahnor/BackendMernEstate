import { Timestamp } from "bson";
import mongoose from "mongoose";
import { type } from "os";

const Userschema = mongoose.Schema({
    username:{
        type: String,
        required : true,
        unique:true
    },
      email:{
        type: String,
        required : true,
        unique:true
    },
      password:{
        type: String,
        required : true,
   
    },
    avator: {
      type:String,
      default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    }
},{Timestamp:true});

const User = mongoose.model("User",Userschema);

export default User;