const Listing = require("../models/listingSchema");
const {isLoggedIn,isOwner} = require("../middleware")
module.exports.index=async (req,res,next)=>{
  try {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings})
    
  } catch (err) {
    next(err)
  }
}

module.exports.renderNewForm=(req,res)=>{
  res.render("listing/new.ejs");
}
module.exports.show=async(req,res,next) =>{
  try{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
    }}).populate("owner");
    if(!listing){
      req.flash("error","Listing that you are trying to access is does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
  } catch(err){
    next(err);
  }
}

module.exports.create=async(req,res,next)=>{
  try {
    if(!req.body.listing){
      throw new ExpressError(400,"Send valid listing data!");
    }
    let url = req.file.path;
    let filename = req.file.filename;
      const newListing = new Listing(req.body.listing);
      newListing.image={url,filename};
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing is created");
      res.redirect("/listings");
  } catch (err) {
    next(err);
  }
  
   
}
module.exports.editForm = async(req,res,next)=>{
   try {
     const {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing that you are trying to edit is does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing});
  } catch (err) {
    next(err)
  }
}

module.exports.edit =async(req,res,next)=>{
  try{
    let {id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename}
        await listing.save();
   }
    req.flash("success","Listing Edited");
    res.redirect(`/listings/${id}`)
  } catch(err){
    next(err);
  }
}
module.exports.delete=async(req,res,next)=>{
  try{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing is Deleted");
    res.redirect("/listings");
  }catch(err){
    next(err);
  }
}