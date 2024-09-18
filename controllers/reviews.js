const listing = require('../models/listing');
const Review= require('../models/review');
module.exports.createreview=async(req,res)=>{
    let details = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    
    details.reviews.push(newreview);
    await newreview.save();
    await details.save();
    req.flash("success","New Review Created");
    console.log("new review save");
    res.redirect(`/listings/${details._id}`)

 };
 module.exports.deleteRoute=async(req,res)=>{
    let {id ,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
 };