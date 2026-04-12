const Listing=require('../models/listing.models.js')

module.exports.index=async (req, res) => {
  const { search } = req.query;
  let query = {};
  
  if (search) {
    const regex = new RegExp(search, "i");
    query = {
      $or: [
        { title: regex },
        { location: regex },
        { country: regex }
      ]
    };
  }

  const allListings = await Listing.find(query);
  if (req.accepts('json')) {
    return res.json({ allListings });
  }
  res.render("listings/index", { allListings });
}

module.exports.renderNewForm= (req, res) => {
  console.log(req.user)
  if (req.accepts('json')) {
    return res.json({ success: true, message: "Ready for new listing form" });
  }
  res.render("listings/new");
}

module.exports.showlisting=async (req, res) => {
  let { id } = req.params;
  const cleanID = id.trim();
  const listing = await Listing.findById(cleanID).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested does not exist !")
    if (req.accepts('json')) return res.status(404).json({ error: "Listing you requested does not exist !" });
    return res.redirect("/listings");
  }
  console.log(listing)
  if (req.accepts('json')) {
    return res.json({ listing });
  }
  res.render("listings/show", { listing });
}

module.exports.createListing=async (req, res, next) => {

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id; // assigning the owner of listing
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","new listing created !")
    if (req.accepts('json')) {
      return res.json({ success: true, listing: newListing, redirectUrl: "/listings" });
    }
    res.redirect("/listings");  // redirect to index.ejs
  
}

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const cleanID = id.trim();
  const listing = await Listing.findById(cleanID);
   if(!listing){
    req.flash("error","Listing you requested does not exist !")
    if(req.accepts('json')) return res.status(404).json({error: "Listing you requested does not exist !"});
    return res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl= originalImageUrl.replace('/upload','/upload/h_300,w_250')
  if(req.accepts('json')){
    return res.json({ listing, originalImageUrl });
  }
  res.render("listings/edit", { listing,originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
 const id = req.params.id.trim();


  // 1. Update listing fields (except image)
  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    {
      new: true,
      runValidators: true,
    }
  );

  // Safety check (optional but good)
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // 2. If a new image is uploaded, update it
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  // 3. Success flash
  req.flash("success", "Listing updated successfully!");
  if(req.accepts('json')) {
    return res.json({ success: true, listing, redirectUrl: `/listings/${id}` });
  }
  res.redirect(`/listings/${id}`);
};



  module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let cleanID = id.trim();
  let deletedListing = await Listing.findByIdAndDelete(cleanID);
  console.log(deletedListing);
    req.flash("success","listing deleted !")
  if(req.accepts('json')){
    return res.json({ success: true, redirectUrl: "/listings" });
  }
  res.redirect("/listings");
}