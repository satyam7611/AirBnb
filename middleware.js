const Listing=require('./models/listing.models.js')
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema, reviewSchema}=require('./schema.js') //joi use for schema validation 
const Review=require('./models/review.models.js') //joi use for schema validation 
module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req)
    // console.log(req.path,"..",req.originalUrl)
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create listings!")
    return res.redirect("/login")
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
      const { id } = req.params;
    const cleanID = id.trim();

    const listing = await Listing.findById(cleanID);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not owner of the listing!")
       return   res.redirect(`/listings/${cleanID}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.map((el=>el.message).join(','))
    throw new ExpressError(400, errMsg)
  }
  else{
    next()
  }
}

// module.exports.isReviewAuthor=async (req,res,next)=>{
//       const {id, reviewID} = req.params;
//     const cleanID = reviewID.trim();
//     const listingID=id.trim();

//     const review = await Review.findById(cleanID);
//     if(! review.author._id.equals(res.locals.currUser._id)){
//       req.flash("error","You are not owner of the review!")
//        return   res.redirect(`/listings/${listingID}`);
//     }
//     next();
// }
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;

  const review = await Review.findById(reviewID);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  // ALWAYS use req.user for auth
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
