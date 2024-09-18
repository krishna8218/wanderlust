const express = require('express');

const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing = require('../models/listing');
const  {isLoggedIn,isOwner,validateListing}= require('../middleware.js');
const listingcontroller = require('../controllers/listings.js')
const multer= require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});
router.get('/', wrapAsync(listingcontroller.index));
   //new route
   router.get('/new',isLoggedIn,listingcontroller.renderNewForm);
    //show route
    router.get('/:id',
      wrapAsync(listingcontroller.showListing));
     //create route for new route
router.post('/',isLoggedIn,
upload.single('listing[image]'),
validateListing,
wrapAsync(listingcontroller.createListing));

 //edit route
router.get("/:id/edit", isLoggedIn,isOwner,
   wrapAsync(listingcontroller.renderEditForm));

 
 
 //update route
 router.put('/:id',isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,
   wrapAsync(listingcontroller.updateListing));
 //delete route
 router.delete('/:id',isLoggedIn,isOwner,
   wrapAsync(listingcontroller.destroy));
  module.exports = router;