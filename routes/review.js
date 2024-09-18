const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const Review = require("../models/review.js");
const listing = require('../models/listing');
const {validateReview,isLoggedIn,isreviewauthor}=require('../middleware.js');

const reviewcontroller=require('../controllers/reviews.js');
//reviews route
router.post('/',isLoggedIn,validateReview,
wrapAsync(reviewcontroller.createreview));
 //delete review route
 router.delete("/:reviewId",isLoggedIn,isreviewauthor,
wrapAsync(reviewcontroller.deleteRoute));
 module.exports=router;
