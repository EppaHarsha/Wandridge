
const mongoose = require("mongoose")
const Review = require("./reviewSchema")
const User = require("./userSchema");
const listenSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
})

listenSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listenSchema);
module.exports=Listing;