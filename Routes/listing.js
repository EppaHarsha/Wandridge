const express=require('express');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listingSchema');
const {isLoggedIn,isOwner} = require('../middleware.js');
const ListingController = require("../controller/listingsController.js");
const router = express.Router();
const multer  = require('multer')
const {storage} = require('../cloudinary.js');
const upload = multer({storage})

//Index
router.get("/",ListingController.index)

//new Listing 
router.get("/new",isLoggedIn,ListingController.renderNewForm)

// show route
router.get("/:id",ListingController.show);
//create route
router.post("/",isLoggedIn,upload.single("listing[image]"),ListingController.create)
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,ListingController.editForm)
//update route
router.put("/:id", isOwner,upload.single("listing[image]"),ListingController.edit);

//delete route
router.delete("/:id",isLoggedIn,isOwner,ListingController.delete)
module.exports=router;