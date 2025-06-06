const express=require('express');
const ExpressError=require('../utils/ExpressError');
const Review=require('../models/reviewSchema');
const Listing=require('../models/listingSchema');
const router = express.Router({mergeParams:true});
const {isLoggedIn,isOwner,isReviewAuthor} = require('../middleware.js');
const ReviewController = require("../controller/reviewController.js");

router.post("/",isLoggedIn,ReviewController.createReview);
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,ReviewController.destroyReview)

module.exports=router;