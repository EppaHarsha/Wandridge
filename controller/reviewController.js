const Review = require('../models/reviewSchema');
const Listing=require('../models/listingSchema');

module.exports.createReview = async(req,res,next)=>{
  try {
    let listing = await  Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
      console.log(newReview);
      await  newReview.save();
      await listing.save();
     console.log("New Review Saved");
     req.flash("success","New Review is created");
     res.redirect(`/listings/${listing._id}`)
  } catch (err) {
    next(err);
  }
   
}

module.exports.destroyReview=async(req,res,next)=>{
  try {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
}