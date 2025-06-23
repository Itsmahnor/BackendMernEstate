import mongoose from "mongoose";

const listingschema = mongoose.Schema({
    name:{
        type: String,
        required : true,
        unique:true
    },
      description:{
        type: String,
        required : true,
        unique:true
    },
      address:{
        type: String,
        required : true,
   
    },
    regularPrice: {
      type:Number,
      required : true,
    },
    discountPrice :{
        type:Number,
        required:true
    },
    bedrooms:{
        type:Number,
        required:true 
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true
    },
    userRef:{
       type:String,
        required:true 
    }
},{Timestamp:true});

const Listing = mongoose.model("Listing",listingschema);

export default Listing;