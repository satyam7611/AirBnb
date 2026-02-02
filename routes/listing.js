const express=require('express')
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js')

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require('../controllers/listing.controllers.js')  // listing controllers
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({storage})


// Post Route wrapAsync for using the middleware 
// create route  index route

router
      .route('/')
      .get( wrapAsync(listingController.index))
      .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
   

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// Show Route  Update Route  Delete Route


router.route('/:id')
                   .get( wrapAsync(listingController.showlisting))
                   .put(  isLoggedIn,upload.single("listing[image]"),isOwner,validateListing,wrapAsync(listingController.updateListing))
                   .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));





router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports=router;