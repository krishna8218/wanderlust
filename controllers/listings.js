const listing=require('../models/listing');
module.exports.index=async(req, res)=>{
        const details = await listing.find({});
        res.render("../views/listings/index.ejs",{ details }); 
};
module.exports.renderNewForm=(req,res)=>{
     
    res.render("../views/listings/new.ejs");
 };
 module.exports.showListing=async(req, res)=>{
    let {id}=req.params;
    const details =await listing.findById(id)
    .populate({path:"reviews",
     populate: {
     path:"author",
    }})
    .populate("owner");
    if(!details){
     req.flash("error","Listing you requested for does't exist !");
     res.redirect('/listings');
    }
    console.log(details);
    res.render("../views/listings/show.ejs", { details });
 };
 module.exports.createListing=async(req, res,  next)=>{
   let url=req.file.path;
   let filename=req.path.filename;
   console.log(url,"..",filename);
  
     
    const details =  await new listing(req.body.listing);
   
    details.owner=req.user._id;
    details.image={url, filename};
    await details.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');

 };
 module.exports.renderEditForm=async (req, res)=>{
    let {id}=req.params;
    const details =await listing.findById(id);
    if(!details){
      req.flash("error","Listing you requested for does't exist !");
      res.redirect('/listings');
     }
     let originalUrl=details.image.url;
     originalUrl=originalUrl.replace("/upload","/upload/h_250,w_250");
    res.render("../views/listings/edit.ejs",{details ,originalUrl})
 }
 module.exports.updateListing=async(req, res)=>{

    let { id } = req.params;
   const details=await listing.findByIdAndUpdate(id,{ ...req.body.listing});
   if(typeof req.file !=="undefined"){
   let url=req.file.path;
   let filename=req.path.filename;
   details.image={url,filename};
   await details.save();
   }
   req.flash("success","Listing Updated !");
   res.redirect(`/listings/${id}`);
 };
 module.exports.destroy=async(req, res)=>{
    let { id } = req.params;
    const details=await listing.findByIdAndDelete(id);
    console.log(details);
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
 };