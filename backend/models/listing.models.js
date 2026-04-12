const mongoose = require("mongoose");

// const Schema=new  mongoose.Schema();
const Review=require('./review.models.js')
const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  image: {
      url:String,
      filename:String
},
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
      }
    ],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true },
);
// middleware for if post deleted then its comment also get deleted 😎

 listingSchema.post('findOneAndDelete',async(listing)=>{
  await Review.deleteMany({_id:{$in:listing.reviews}})
 })

const Listing = mongoose.model("Listing", listingSchema);   // in DB listings will be there instead of Listing


module.exports = Listing;
