 if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
 }
 const express= require('express');
const app = express();
const mongoose = require('mongoose');
// const mongo_url = "mongodb://localhost:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;
const listings = require('./routes/listing.js');
const path = require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverRide=require('method-override'); // to convert post to put method in html form
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore=require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStatergy = require('passport-local');
const User = require('./models/user.js');



const reviews = require('./routes/review.js');
const router = require('./routes/user.js');
//require joi
// to connect database
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{
    console.log("connected to Db");
}).catch(err=>{
    console.log(err);
});
app.use(methodOverRide("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,'./public')));


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    
    },
    touchAfter:24*3600,
 });
store.on("error",()=>{
    console.log("Error in MOngo session store",err);
})


 const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
 };
 

 app.use(session(sessionOptions));
 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStatergy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());






 app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user;
    next();
 })

 //demo user
 app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"abc@gmail.com",
        username:"delta-student"
    })
    let res2=await User.register(fakeUser,"helloworld");
    res.send(res2);
 })

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);
app.use('/',router);
 

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"));
})


app.use((err , req, res, next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("../views/error.ejs",{err});
  

});
app.listen(3000,()=>{
    console.log(`server is listening on ${3000}`);
})