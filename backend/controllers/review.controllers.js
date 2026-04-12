const Listing=require('../models/listing.models')
const Review=require('../models/review.models.js') //joi use for schema validation 

module.exports.createReview=async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review)
console.log(newReview)
newReview.author=req.user._id;
listing.reviews.push(newReview);
 await newReview.save();
await listing.save();  
console.log("new review saved")
  req.flash("success","new review created !")
if (req.accepts('json')) {
  return res.json({ success: true, redirectUrl: `/listings/${listing._id}` });
}
res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
  let {id,reviewID}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}})
  await Review.findByIdAndDelete(reviewID);
    req.flash("success","new review deleted !")
  if (req.accepts('json')) {
    return res.json({ success: true, redirectUrl: `/listings/${id}` });
  }
  res.redirect(`/listings/${id}`)
}